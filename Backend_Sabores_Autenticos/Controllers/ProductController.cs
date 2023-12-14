using Backend_Sabores_Autenticos.Data;
using Backend_Sabores_Autenticos.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend_Sabores_Autenticos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IWebHostEnvironment _env;


        public ProductController(DataContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }


        [Authorize]
        [HttpGet]
        public IActionResult GetProductsWFilterName(string? search)
        {
            IQueryable<Product> query = _context.Products;

            if (search != null)
            {
                query = query.Where(prod => prod.PdtName.Contains(search));
            }

            var prods = query.ToList();

            return Ok(prods);

        }

        [Authorize(Roles = "admin")]
        [HttpGet("{id}")]
        public IActionResult GetProductById(int id)
        {
            var prod = _context.Products.Find(id);

            if (prod == null)
            {
                ModelState.AddModelError("Error", "El producto no existe en el sistema");
                return BadRequest(ModelState);
            }

            return Ok(prod);
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        [Consumes("multipart/form-data")]
        public IActionResult CreateProduct([FromForm] ProductDto request)
        {
            //DEBUG
            // Log the received data
            Console.WriteLine($"PdtName: {request.PdtName}");
            Console.WriteLine($"PdtDescription: {request.PdtDescription}");
            Console.WriteLine($"Price: {request.Price}");
            Console.WriteLine($"ImageFile: {request.ImageFile}");
            // Chequeamos si existe el rut en la base de datos

            var productCheck = _context.Products.Count(prod => prod.PdtName.ToLower() == request.PdtName.ToLower());
            if (productCheck > 0)
            {
                ModelState.AddModelError("Error", "El producto ingresado ya existe");
                return BadRequest(ModelState);
            }

            // Chequeamos si existe una imagen
            if (request.ImageFile == null)
            {
                ModelState.AddModelError("Error", " Se requiere un archivo imagen para crear un producto, seleccione un archivo .jpg, .png o .webp ");
                return BadRequest(ModelState);
            }



            string newImgName = DateTime.Now.ToString("yyyMMddHHmmssfff");
            newImgName += Path.GetExtension(request.ImageFile.FileName);

            string imgFolder = _env.WebRootPath + "/images/";

            using (var stream = System.IO.File.Create(imgFolder + newImgName))
            {
                request.ImageFile.CopyTo(stream);
            };

            Product product = new Product()
            {
                PdtName = request.PdtName,
                PdtDescription = request.PdtDescription,
                Price = request.Price,
                ImageName = newImgName
            };

            _context.Products.Add(product);
            _context.SaveChanges();

            return Ok(product);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var product = _context.Products.Find(id);

            if (product == null)
            {
                ModelState.AddModelError("Error", "El producto no existe en el sistema");
                return BadRequest(ModelState);
            }

            _context.Products.Remove(product);
            _context.SaveChanges();

            var response = new
            {
                message = "Procedimiento exitoso. El producto se ha eliminado del sistema"
            };

            return Ok(response);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public IActionResult UpdateProduct([FromForm] ProductDto request, int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                ModelState.AddModelError("Error", "El producto no existe en el sistema");
                return BadRequest(ModelState);
            }

            if (request.Price > 0)
            {
                if (request.ImageFile == null)
                {
                    product.PdtName = request.PdtName;
                    product.PdtDescription = request.PdtDescription;
                    product.Price = request.Price;

                    _context.SaveChanges();

                    Product updatedProduct = new Product()
                    {
                        PdtName = request.PdtName,
                        PdtDescription = request.PdtDescription,
                        Price = request.Price
                    };

                    return Ok(updatedProduct);
                }
                else
                {
                    string imgNameFromFile = Path.GetExtension(request.ImageFile.FileName);

                    string imgFolder = _env.WebRootPath + "/images/products";

                    using (var stream = System.IO.File.Create(imgFolder + imgNameFromFile))
                    {
                        request.ImageFile.CopyTo(stream);
                    };

                    product.PdtName = request.PdtName;
                    product.PdtDescription = request.PdtDescription;
                    product.Price = request.Price;
                    product.ImageName = request.ImageFile.FileName;

                    _context.SaveChanges();

                    Product updateProduct = new Product()
                    {
                        PdtName = request.PdtName,
                        PdtDescription = request.PdtDescription,
                        Price = request.Price,
                        ImageName = request.ImageFile.FileName
                    };

                    return Ok(updateProduct);
                }
            }
            else
            {
                ModelState.AddModelError("Error", "La cantidad y el precio del producto deben ser mayores a 0");
                return BadRequest(ModelState);
            }
        }
    }
}