using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CustomersWeb.Startup))]
namespace CustomersWeb
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
