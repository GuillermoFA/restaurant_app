using Backend_Sabores_Autenticos.Data;
using Backend_Sabores_Autenticos.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SignalRReactive.Hubs;


namespace Backend_Sabores_Autenticos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly DataContext context;

        private IHubContext<MessageHub> hubContext;

        public OrderController(DataContext _context, IHubContext<MessageHub> _hubContext)
        {
            context = _context;
            hubContext = _hubContext;
        }

        string[] googleMapsLinks = {
            "https://maps.app.goo.gl/8EJYtZH11UXeG7fD6",
            "https://maps.app.goo.gl/wWvUaPG3bYjambW78",
            "https://maps.app.goo.gl/nVN3dR6YV2JC9oYm9",
            "https://maps.app.goo.gl/2rSHNLPZMneyA57DA",
            "https://maps.app.goo.gl/ZpE9pgrcNFTSdRmJ8",
            "https://maps.app.goo.gl/LfdfTJAWaSA2kUtc7"
        };



        [Authorize(Roles = "admin")]
        [HttpPatch("orderIdToEnProceso")]
        public IActionResult ChangeStatusToEnProceso(int orderIdToEnProceso)
        {
            var Order = context.Orders.Find(orderIdToEnProceso);

            Order!.Status = "En proceso";

            context.Update(Order);
            context.SaveChanges();

            var showJson = new
            {
                Order
            };
            return Ok(showJson);
        }

        [Authorize(Roles = "admin")]
        [HttpPatch("orderIdToCompletado")]
        public IActionResult ChangeStatusToCompletado(int orderIdToCompletado)
        {
            var Order = context.Orders.Find(orderIdToCompletado);

            Order!.Status = "Completado";

            context.Update(Order);
            context.SaveChanges();

            var customer = context.Customers.Find(Order.CustomerId);

            Console.WriteLine($"Enviando mensaje a {customer!.Rut}");
            hubContext.Clients.Group(customer!.Rut).SendAsync("OrderReady", "Tu pedido está listo");
            return Ok(Order);
        }

        [Authorize(Roles = "admin")]
        [HttpPatch("orderIdToCancelado")]
        public IActionResult ChangeStatusToCancelado(int orderIdToCancelado)
        {
            var Order = context.Orders.Find(orderIdToCancelado);

            Order!.Status = "Cancelado";

            context.Update(Order);
            context.SaveChanges();

            return Ok(Order);
        }

        [HttpPost("registerOrder")]
        public IActionResult RegisterOrder(OrderDto request)
        {
            Customer customer = context.Customers.Find(request.CustomerId)!;
            DateTime actualDate = DateTime.Now;

            List<int> IdPerItem = new List<int>();
            List<int> QuantityPerItem = new List<int>();

            int totalPrice = 0;

            Order order = new Order();

            order.CustomerId = request.CustomerId;
            order.Status = "En espera";
            order.Comments = request.Comment;
            order.CreatedAt = actualDate;



            foreach (int prodId in request.ArrayOfProdId)
            {
                int index;
                if (IdPerItem.Contains(prodId))
                {
                    index = IdPerItem.IndexOf(prodId);
                    QuantityPerItem[index] += 1;

                }
                else
                {
                    IdPerItem.Add(prodId);
                    QuantityPerItem.Add(1);

                }
            }

            for (int i = 0; i < IdPerItem.Count; i++)
            {
                var product = context.Products.Find(IdPerItem[i]);

                if (product != null)
                {
                    var orderItem = new OrderItem();
                    orderItem.ProductId = IdPerItem[i];
                    orderItem.UnitPrice = product.Price;
                    orderItem.Quantity = QuantityPerItem[i];
                    totalPrice += product.Price * QuantityPerItem[i];
                    order.OrderItems.Add(orderItem);
                }

            };


            order.TotalPrice = totalPrice;
            context.Orders.Add(order);
            context.SaveChanges();

            foreach (var item in order.OrderItems)
            {
                item.Order = null!;
            }

            return Ok(order);
        }


        [Authorize(Roles = "admin")]
        [HttpGet("getEnEspera")]
        public IActionResult GetOrdersEnEspera()
        {
            var OrdersWithCustomer = context.Orders.Where(order => order.Status.Contains("En espera"))
            .Include(order => order.Customer)
            .Include(order => order.OrderItems)
            .ThenInclude(ordItem => ordItem.Product).ToList();

            foreach (var order in OrdersWithCustomer)
            {
                foreach (var item in order.OrderItems)
                {

                    item.Order = null!;
                }
            }

            return Ok(OrdersWithCustomer);

        }

        [Authorize]
        [HttpGet("customerOrdersEnEspera/{customerId}")]
        public IActionResult GetEnEsperaPerCustomer(int customerId)
        {

            var OrdersByCustomer = context.Orders.Where(order => order.CustomerId == customerId)
            .Where(order => order.Status.Contains("En espera"))
            .Include(order => order.Customer)
            .Include(order => order.OrderItems)
            .ThenInclude(ordItem => ordItem.Product).ToList();

            foreach (var order in OrdersByCustomer)
            {
                foreach (var item in order.OrderItems)
                {

                    item.Order = null!;
                }
            }

            return Ok(OrdersByCustomer);

        }

        [Authorize]
        [HttpGet("customerOrdersEnProceso/{customerId}")]
        public IActionResult GetEnProcesoPerCustomer(int customerId)
        {

            var OrdersByCustomer = context.Orders.Where(order => order.CustomerId == customerId)
            .Where(order => order.Status.Contains("En proceso"))
            .Include(order => order.Customer)
            .Include(order => order.OrderItems)
            .ThenInclude(ordItem => ordItem.Product).ToList();

            foreach (var order in OrdersByCustomer)
            {
                foreach (var item in order.OrderItems)
                {

                    item.Order = null!;
                }
            }

            return Ok(OrdersByCustomer);

        }

        [Authorize]
        [HttpGet("customerOrdersCompletado/{customerId}")]
        public IActionResult GetCompletadoPerCustomer(int customerId)
        {

            var OrdersByCustomer = context.Orders.Where(order => order.CustomerId == customerId)
            .Where(order => order.Status.Contains("Completado"))
            .Include(order => order.Customer)
            .Include(order => order.OrderItems)
            .ThenInclude(ordItem => ordItem.Product).ToList();

            foreach (var order in OrdersByCustomer)
            {
                foreach (var item in order.OrderItems)
                {

                    item.Order = null!;
                }
            }

            return Ok(OrdersByCustomer);

        }

        [Authorize(Roles = "admin")]
        [HttpGet("getEnProceso")]
        public IActionResult GetOrdersEnProceso()
        {
            var OrdersWithCustomer = context.Orders.Where(order => order.Status.Contains("En proceso"))
            .Include(order => order.Customer)
            .Include(order => order.OrderItems)
            .ThenInclude(ordItem => ordItem.Product);

            foreach (var order in OrdersWithCustomer)
            {
                foreach (var item in order.OrderItems)
                {

                    item.Order = null!;
                }
            }

            return Ok(OrdersWithCustomer);

        }

        [Authorize(Roles = "admin")]
        [HttpGet("getFinalizados")]
        public IActionResult GetOrdersFinalizados()
        {
            var OrdersWithCustomerFinished = context.Orders.Where(order => order.Status.Contains("Completado") || order.Status.Contains("Cancelado"))
            .Include(order => order.Customer)
            .Include(order => order.OrderItems)
            .ThenInclude(ordItem => ordItem.Product);

            foreach (var order in OrdersWithCustomerFinished)
            {
                foreach (var item in order.OrderItems)
                {

                    item.Order = null!;
                }
            }

            return Ok(OrdersWithCustomerFinished);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{orderIdToDelete}")]
        public IActionResult DeleteOrder(int orderIdToDelete)
        {
            var order = context.Orders.Find(orderIdToDelete);
            if (order == null)
            {
                ModelState.AddModelError("Error", "La orden que no existe");
                return BadRequest(ModelState);
            }

            context.Orders.Remove(order);
            context.SaveChanges();

            var response = new
            {
                message = "Procedimiento exitoso. El producto se ha eliminado del sistema"
            };
            return Ok(response);
        }
    }
}