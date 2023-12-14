using System.Security.Claims;
using Backend_Sabores_Autenticos.Data;
using Microsoft.AspNetCore.SignalR;

namespace SignalRReactive.Hubs
{
    public class MessageHub : Hub
    {
        private readonly DataContext _context;

        public MessageHub(DataContext context)
        {
            _context = context;
        }
        public override async Task OnConnectedAsync()
        {
            
            await base.OnConnectedAsync();
        }

        public async Task AsignarUsuarioAGrupo(string customerRut)
        {
            // Asegúrate de validar los parámetros y realizar cualquier lógica adicional necesaria
            Console.WriteLine($"{customerRut}");
            // Obtiene el ConnectionId del usuario por su nombre
            var connectionId = Context.ConnectionId;

            // Agrega el ConnectionId al grupo específico
            if (!string.IsNullOrEmpty(connectionId))
            {
                await Groups.AddToGroupAsync(connectionId, customerRut);
                Console.WriteLine($"Usuario {connectionId} agregado al grupo {customerRut}");
            }
        }

        public async Task SendOrderReadyNotification(string customerRut)
        {
            await Clients.Group(customerRut).SendAsync("OrderReady", "Tu pedido está listo");
        }
    }
}