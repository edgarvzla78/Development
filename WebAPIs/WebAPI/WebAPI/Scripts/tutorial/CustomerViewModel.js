//This only helps us with the intellisense, we’ll have to reference the jQuery and KnockoutJS files later in the view.
/// <reference path="../jquery-1.10.2.min.js" />
/// <reference path="../knockout-3.4.1.js" />

function customer(id, name, age, comments) {
    var self = this;

    self.Id = id;
    self.Name = name;
    self.Age = age;
    self.Comments = comments;

    self.addCustomer = function () {
        $.ajax({
            type: 'post',
            url: "/api/Customers/",
            data: ko.toJSON(this),
            //dataType: "json",
            contentType: 'application/json',
            success: function (result) {

            }
        });
    }
}

//Create the ViewModel that we can use to contain the list of all customers.
function CustomerVM() {
    var self = this;

    self.customers = ko.observableArray([]);

    self.getCustomers = function () {
        self.customers.removeAll();
        $.getJSON("/api/Customers/", function (data) {
            $.each(data, function (key, value) {
                self.customers.push(new customer(value.Id, value.Name, value.Age, value.Comments));
            });            
        });
    }
}

$(function () {
    ko.applyBindings(new CustomerVM(), document.getElementById('displayNode'));
    ko.applyBindings(new customer(), document.getElementById('createNode'));
});
