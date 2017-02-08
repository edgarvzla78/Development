using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace CustomersWeb.Models
{
    public class Customer
    {
        [Display(Name="Id")]
        public int Id { get; set; }
        [Display(Name = "Name")]
        public string Name { get; set; }
        [Display(Name = "Age")]
        public short Age { get; set; }
        [Display(Name = "Comments")]
        public string Comments { get; set; }
    }
}