using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebAPI.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }

        public ActionResult Introduction()
        {
            ViewBag.Message = "The Introduction to Knockout JS Page.";

            return View();
        }

        public ActionResult Customers()
        {
            return View();
        }
    }
}
