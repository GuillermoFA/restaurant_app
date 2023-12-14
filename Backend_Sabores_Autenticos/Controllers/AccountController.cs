using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Backend_Sabores_Autenticos.Data;
using Backend_Sabores_Autenticos.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Backend_Sabores_Autenticos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {

        public AccountController(IConfiguration configuration, DataContext context)
        {
            _configuration = configuration;
            _context = context;
        }


        private readonly IConfiguration _configuration;
        private readonly DataContext _context;

        //Se agregan las expresiones regulares para verificar Rut y Correo electrónico
        private static readonly string rutPattern = @"^(\d{1,3}(?:\.\d{1,3}){2}-[\dK])$";
        private static readonly string emailPattern = @"^[a-zA-Z0-9.!#$%&'*+\=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";
        readonly Regex rgx = new Regex(rutPattern);
        readonly Regex ergx = new Regex(emailPattern);

        [HttpPost("register")]
        public IActionResult Register(CustomerDto request)
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
                    Role = "client",
                    PasswordHashed = passwordHashed,
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


        [HttpPost("login")]
        public IActionResult Login(string email, string password)
        {
            //verificamos que el correo efectivamente este registrado
            var customer = _context.Customers.FirstOrDefault(c => c.Email == email);
            if (customer == null)
            {
                ModelState.AddModelError("Error", "El correo ingresado no se encuentra registrado");
                return BadRequest(ModelState);
            }

            //verificamos la contraseña de acuerdo al usuario identificado con el correo
            if (!BCrypt.Net.BCrypt.Verify(password, customer.PasswordHashed))
            {
                ModelState.AddModelError("Error", "La contraseña es incorrecta");
                return BadRequest(ModelState);
            }

            if (customer.IsActive == false)
            {
                ModelState.AddModelError("Error", "Esta cuenta ha sido deshabilitada a usar nuestros servicios BugBusterCL");
                return BadRequest(ModelState);
            }

            //creamos un JWT con el usuario identificado
            string token = CreateJWT(customer);
            //creamos un cuerpo de respuesta que contiene el token, el rut del usuario que se logeara, el nombre y correo
            var response = new
            {
                token,
                customer.Id,
                customer.Rut,
                customer.Name,
                customer.Email,
                customer.Role,
                message = "Procedimiento exitoso. Ha iniciado sesión"
            };

            //enviamos la respuesta
            return Ok(response);
        }

        [HttpPost("loginWeb")]
        public IActionResult LoginWeb(string email, string password)
        {
            //verificamos que el correo efectivamente este registrado
            var customer = _context.Customers.FirstOrDefault(c => c.Email == email);
            if (customer == null)
            {
                ModelState.AddModelError("Error", "El correo ingresado no se encuentra registrado");
                return BadRequest(ModelState);
            }

            if (customer.Role != "admin")
            {
                ModelState.AddModelError("Error", "El usuario no tiene las credenciales correctas para iniciar sesión");
                return BadRequest(ModelState);
            }

            //verificamos la contraseña de acuerdo al usuario identificado con el correo
            if (!BCrypt.Net.BCrypt.Verify(password, customer.PasswordHashed))
            {
                ModelState.AddModelError("Error", "La contraseña es incorrecta");
                return BadRequest(ModelState);
            }

            if (customer.IsActive == false)
            {
                ModelState.AddModelError("Error", "Esta cuenta ha sido deshabilitada a usar nuestros servicios BugBusterCL");
                return BadRequest(ModelState);
            }
            //creamos un JWT con el usuario identificado
            string token = CreateJWT(customer);
            //creamos un cuerpo de respuesta que contiene el token, el rut del usuario que se logeara, el nombre y correo
            var response = new
            {
                token,
                customer.Id,
                customer.Rut,
                customer.Name,
                customer.Email,
                customer.Role,
                customer.IsActive,
                message = "Procedimiento exitoso. Ha iniciado sesión"
            };

            //enviamos la respuesta
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