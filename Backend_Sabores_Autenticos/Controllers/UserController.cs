
using Backend_Sabores_Autenticos.Data;
using Backend_Sabores_Autenticos.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.IdentityModel.Tokens;

namespace Backend_Sabores_Autenticos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {


        private static readonly string rutPattern = @"^(\d{1,3}(?:\.\d{1,3}){2}-[\dK])$";
        private static readonly string emailPattern = @"^[a-zA-Z0-9.!#$%&'*+\=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";
        readonly Regex rgx = new Regex(rutPattern);
        readonly Regex ergx = new Regex(emailPattern);

        public UserController(IConfiguration configuration, DataContext context)
        {
            _configuration = configuration;
            _context = context;
        }


        private readonly IConfiguration _configuration;
        private readonly DataContext _context;

        /*
        [Authorize(Roles = "admin")]
        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _context.Customers.ToList();
            return Ok(users);
        }
        */

        [Authorize(Roles = "admin")]
        [HttpGet]
        public IActionResult GetUsersByRole(string? role, string? search)
        {
            IQueryable<Customer> query = _context.Customers;

            if (search != null)
            {
                query = query.Where(user => user.Rut.Contains(search) || user.Name.Contains(search));
            }

            if (role != null)
            {
                query = query.Where(user => user.Role == role);
            }

            var users = query.ToList();

            return Ok(users);

        }

        [Authorize(Roles = "admin")]
        [HttpGet("{id}")]
        public IActionResult GetUserById(int id)
        {
            var user = _context.Customers.Find(id);

            if (user == null)
            {
                ModelState.AddModelError("Error", "El usuario no existe en el sistema");
                return BadRequest(ModelState);
            }

            return Ok(user);
        }

        [Authorize(Roles = "admin")]
        [HttpPost("registerOnlyToAdmin")]
        public IActionResult AdminRegister(CustomerToAdminDto request)
        {

            // Chequeamos si el rut esta ingresado correctamente mediante el regex
            if (rgx.IsMatch(request.Rut))
            {
                // Chequeamos si existe el rut en la base de datos
                var rutCheck = _context.Customers.Count(u => u.Rut == request.Rut);
                if (rutCheck > 0)
                {
                    ModelState.AddModelError("Error", "El rut ingresado ya existe");
                    return BadRequest(ModelState);
                }
            }
            else
            {
                ModelState.AddModelError("Error", "El rut ingresado no tiene el formato correcto, use el siguiente ejemplo: 19.999.888-K | 19.999.888-7");
                return BadRequest(ModelState);
            }

            // Chequeamos que el correo ingresado tenga el formato adecuado
            if (ergx.IsMatch(request.Email))
            {
                // Chequeamos si existe el correo en la base de datos
                var emailCheck = _context.Customers.Count(u => u.Email == request.Email);
                if (emailCheck > 0)
                {
                    ModelState.AddModelError("Error", "El correo ingresado ya existe");
                    return BadRequest(ModelState);
                }
            }
            else
            {
                ModelState.AddModelError("Error", "El correo ingresado no tiene el formato correcto, evite usar puntos al comienzo y usar un unico caracter especial '@'.");
                return BadRequest(ModelState);
            }

            var rolInput = request.Role;
            if (rolInput != "client" && rolInput != "admin")
            {
                ModelState.AddModelError("Error", "No se reconoce el rol ingresado, favor de ingresar 'client' o 'admin'");
                return BadRequest(ModelState);
            }

            //si hasta este punto los dos chequeos no han arrojado ningun problema, y el cuerpo proveniente
            // del front end tiene la estructura correcta es decir que tenga Rut, Name, Email y la password
            if (ModelState.IsValid)
            {
                //procedemos a hashear la password del usuario
                string passwordHashed = BCrypt.Net.BCrypt.HashPassword(request.Password);

                //creamos el usuario segun su entidad
                var newCustomer = new Customer
                {
                    Rut = request.Rut,
                    Name = request.Name,
                    Email = request.Email,
                    PasswordHashed = passwordHashed,
                    Role = request.Role,
                    IsActive = true

                };

                //agregamos la entidad a la base de datos que sigue la estructura del modelo creado "Customer.cs"
                _context.Customers.Add(newCustomer);
                //guardamos los cambios en la base de datos
                _context.SaveChanges();
                //creamos un Json web token con validacion de 1 minuto
                var jwt = CreateJWT(newCustomer);
                //retornamos un 200 con el mensaje que se concreto de manera exitosa el registro de usuario
                var response = new
                {
                    message = "Procedimiento exitoso. Se ha registrado exitosamente"
                };
                return Ok(response);
            }

            //si por algun motivo el cuerpo no contiene todo lo necesario se ejecuta un badrequest con el mensaje debido.
            ModelState.AddModelError("Error", "El registro no se ha concretado de manera exitosa");
            return BadRequest(ModelState);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, CustomerToAdminDto customerDto)
        {
            var user = _context.Customers.Find(id);

            if (user == null)
            {
                ModelState.AddModelError("Error", "El usuario no existe en el sistema");
                return BadRequest(ModelState);
            }

            // Chequeamos si el rut esta ingresado correctamente mediante el regex
            if (rgx.IsMatch(customerDto.Rut))
            {

            }
            else
            {
                ModelState.AddModelError("Error", "El rut ingresado no tiene el formato correcto, use el siguiente ejemplo: 19.999.888-K | 19.999.888-7");
                return BadRequest(ModelState);
            }

            // Chequeamos que el correo ingresado tenga el formato adecuado
            if (ergx.IsMatch(customerDto.Email))
            {

            }
            else
            {
                ModelState.AddModelError("Error", "El correo ingresado no tiene el formato correcto, evite usar puntos al comienzo y usar un unico caracter especial '@'.");
                return BadRequest(ModelState);
            }

            var rolInput = customerDto.Role;
            if (rolInput != "client" && rolInput != "admin")
            {
                ModelState.AddModelError("Error", "No se reconoce el rol ingresado, favor de ingresar 'client' o 'admin'");
                return BadRequest(ModelState);
            }

            string passwordHashed = BCrypt.Net.BCrypt.HashPassword(customerDto.Password);

            user.Name = customerDto.Name;
            user.Rut = customerDto.Rut;
            user.Email = customerDto.Email;
            user.PasswordHashed = passwordHashed;
            user.Role = customerDto.Role;
            //user.IsActive = user.IsActive;

            _context.SaveChanges();

            var response = new
            {
                name = customerDto.Name,
                rut = customerDto.Rut,
                email = customerDto.Email,
                password = passwordHashed,
                role = customerDto.Role,
                //isActive = user.IsActive,
                message = "Procedimiento exitoso. Los datos del usuario se han actualizado en el sistema"
            };

            return Ok(response);
        }


        [Authorize(Roles = "admin")]
        [HttpPut("UnActivateUser/{id}")]
        public IActionResult UnActivateUser(int id)
        {
            var user = _context.Customers.Find(id);

            if (user != null)
            {
                user.IsActive = false;
                _context.SaveChanges();



                var response = new
                {
                    name = user.Name,
                    rut = user.Rut,
                    email = user.Email,
                    password = user.PasswordHashed,
                    role = user.Role,
                    isActive = user.IsActive,
                    message = "El usuario se ha deshabilitado"
                };



                return Ok(response);
            }
            ModelState.AddModelError("Error", "El usuario no existe en el sistema");
            return BadRequest(ModelState);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("ActivateUser/{id}")]
        public IActionResult ActivateUser(int id)
        {
            var user = _context.Customers.Find(id);

            if (user != null)
            {
                user.IsActive = true;
                _context.SaveChanges();



                var response = new
                {
                    name = user.Name,
                    rut = user.Rut,
                    email = user.Email,
                    password = user.PasswordHashed,
                    role = user.Role,
                    isActive = user.IsActive,
                    message = "El usuario se ha habilitado"
                };



                return Ok(response);
            }
            ModelState.AddModelError("Error", "El usuario no existe en el sistema");
            return BadRequest(ModelState);
        }


        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _context.Customers.Find(id);

            if (user == null)
            {
                ModelState.AddModelError("Error", "El usuario no existe en el sistema");
                return BadRequest(ModelState);
            }

            _context.Customers.Remove(user);
            _context.SaveChanges();

            var response = new
            {
                message = "Procedimiento exitoso. El usuario se ha eliminado del sistema"
            };

            return Ok(response);
        }


        private string CreateJWT(Customer customer)
        {

            // Los claims se crean para que pueda diferenciar los roles o variables propias de la clase AccountController.cs
            // en este caso el Claim 'Role' se utiliza en [Authorize(Roles = "Admin")] o en su defecto Client
            List<Claim> claims = new List<Claim>()
            {
                new Claim("rut", "" + customer.Rut),
                new Claim("name", "" + customer.Name),
                new Claim("email", "" + customer.Email),
                new Claim("passwordHashed", "" + customer.PasswordHashed),
                new Claim("role", customer.Role)

            };

            string strKey = _configuration["JwtSettings:Key"]!;

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(strKey));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var token = new JwtSecurityToken(

                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }
    }
}