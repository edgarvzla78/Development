using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CustomersWeb.Models;
using CustomersWeb.ViewModels;

namespace CustomersWeb.Controllers
{
    public class CustomersController : Controller
    {
        // GET: Customers
        public ActionResult Index()
        {
            Customers c = new Customers();
            ViewBag.listCustomers = c.findAll();

            return View();
        }


        public ActionResult Customers()
        {
            return View();
        }

        //public IQueryable<Customer> GetAllCustomers()
        //{
        //    Customers c = new Customers();
        //    return c.findAll().AsQueryable();
        //}

        public IEnumerable<Customer> GetAllCustomers()
        {
            Customers c = new Customers();
            return c.findAll();
        }

        [HttpGet]
        public ActionResult Create()
        {   
            return View("Create");
        }

        [HttpPost]
        public ActionResult Create(CustomerViewModel cvm)
        {
            Customers c = new Customers();
            c.Create(cvm.Customer);

            return RedirectToAction("Index");
        }

        public ActionResult Delete(int id)
        {
            Customers c = new Customers();
            c.Delete(id);

            return RedirectToAction("Index");
        }

        [HttpGet]
        public ActionResult Edit(int Id)
        {
            Customers c = new Customers();
            CustomerViewModel cvm = new CustomerViewModel();
            cvm.Customer = c.find(Id);

            return View("Edit", cvm);
        }

        [HttpPost]
        public ActionResult Edit(CustomerViewModel cvm)
        {
            Customers c = new Customers();
            c.Edit(cvm.Customer);

            return RedirectToAction("Index");
        }
    }
}