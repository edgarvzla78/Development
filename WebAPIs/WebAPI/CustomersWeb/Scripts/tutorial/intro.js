

$(function () {
    //Activates knockout.js
    ko.applyBindings(new IntroModel(), document.getElementById('intro'));
        
    ko.applyBindings(new ReservationsViewModel(), document.getElementById('listAndCollections'));

    ko.applyBindings(new SurveyViewModel("Which factors affect your technology choices?", 10, [
        "Functionality, compatibility, pricing - all that boring stuff",
        "How often it is mentioned on Hacker News",
        "Number of gradients/dropshadows on project homepage",
        "Totally believable testimonials on project homepage"
    ]), document.getElementById('customBindings'));

    ko.applyBindings(new extendObservableModel(), document.getElementById('extendObservables'));
    ko.applyBindings(new extendObservableClientModel(clientsFromServer), document.getElementById('extendObservables2'));
});



// pass the "Model" used by Razor
//    ko.applyBindings(new ProfileVm(@Html.Raw(Json.Encode(Model))));

function IntroModel() {
    this.firstName = ko.observable("Edgar");
    this.lastName = ko.observable("Vzla");

    this.fullName = ko.computed(function () {
        return this.firstName() + ' ' + this.lastName();
    }, this);

    this.capitalizeLastName = function () {
        var currentValue = this.lastName();
        this.lastName(currentValue.toUpperCase());
    };
}




//**********************************************************
//**** JAVASCRIPT - Working with Lists and Collections *****
//**********************************************************

// Class to represent a row in the seat reservations grid
function SeatReservation(name, initialMeal) {
    var self = this;
    self.name = name;
    self.meal = ko.observable(initialMeal);
    
    self.formattedPrice = ko.computed( function() {
        var price = self.meal().price;
        return price ? "$" + price.toFixed(2) : "None"
    });
}

// Overall viewmodel for this screen, along with initial state
function ReservationsViewModel() {
    var self = this;

    // Non-editable catalog data - would come from the server
    self.availableMeals = [
        { mealName: "Standard (sandwich)", price: 10 },
        { mealName: "Premium (lobster)", price: 34.95 },
        { mealName: "Ultimate (whole zebra)", price: 290 }
    ];    

    // Editable data
    self.seats = ko.observableArray([
        new SeatReservation("Steve", self.availableMeals[0]),
        new SeatReservation("Bert", self.availableMeals[1])
    ]);
    
    self.addSeat = function() {
        self.seats.push(new SeatReservation("pass. name", self.availableMeals[0]));
    }
    self.removeSeat = function(seat) { self.seats.remove(seat) }
    
    self.totalSurcharge = ko.computed(function() {
        var total = 0;
        for(var i = 0; i < self.seats().length; i++)
            total += self.seats()[i].meal().price;
        return total;
    });
}



//****************************************************************
//************ JAVASCRIPT - Creating Custom Bindings *************
//****************************************************************

function Answer(text) { this.answerText = text; this.points = ko.observable(1); }

var Supply = function (data) {
    this.supplyCode = ko.observable(data.supplyCode);
}

function SurveyViewModel(question, pointsBudget, answers) {
    this.question = question;
    this.pointsBudget = pointsBudget;
    this.answers = $.map(answers, function (text) { return new Answer(text) });
    this.save = function () { alert('To do') };

    this.pointsUsed = ko.computed(function () {
        var total = 0;
        for (var i = 0; i < this.answers.length; i++)
            total += this.answers[i].points();
        return total;
    }, this);

    //Used for the Custom Binding - Enter Key ** ** ** 
    this.newSupply = ko.observable();
    this.supplies = ko.observableArray();
    this.addSupply = function () {
        this.supplies.push(this.newSupply());
    };

    //Used for the Custom Binding - Tooltips ** ** ** 
    this.name = ko.observable("This is the text for a name."),
    this.help = ko.observable("This is my tooltip help.")
};


//**** Custom Bindings ****
ko.bindingHandlers.fadeVisible = {
    init: function (element, valueAccessor) {
        // Start visible/invisible according to initial value
        var shouldDisplay = valueAccessor();
        $(element).toggle(shouldDisplay);
    },
    update: function (element, valueAccessor) {
        //On update, fade in/out
        var shouldDisplay = valueAccessor();
        shouldDisplay ? $(element).fadeIn() : $(element).fadeOut();
    }
};

//Custom Binding - Integrating with third-party components (JQuery Button)
ko.bindingHandlers.jqButton = {
    init: function (element) {
        $(element).button(); // Turns the element into a jQuery UI button
    },
    update: function (element, valueAccessor) {
        var currentValue = valueAccessor();
        // Here we just update the "disabled" state, but you could update other properties too
        $(element).button("option", "disabled", currentValue.enable === false);
    }
};

//Custom Binding - Implement Custom Widgets
ko.bindingHandlers.starRating = {
    init: function (element, valueAccessor) {
        $(element).addClass("starRating");
        for (var i = 0; i < 5; i++)
            $("<span>").appendTo(element);

        // Handle mouse events on the stars
        $("span", element).each(function (index) {
            $(this).hover(
            function () { $(this).prevAll().add(this).addClass("hoverChosen") },
            function () { $(this).prevAll().add(this).removeClass("hoverChosen") }
            ).click(function () {
                var observable = valueAccessor();  // Get the associated observable
                observable(index + 1);               // Write the new rating to it
            });
        });
    },
    update: function (element, valueAccessor) {
        // Give the first x stars the "chosen" class, where x <= rating
        var observable = valueAccessor();
        $("span", element).each(function (index) {
            $(this).toggleClass("chosen", index < observable());
        });
    }
};


//** ** ** Custom Binding - Enter Key ** ** ** 
ko.bindingHandlers.enterKey = {
    init: function (element, valueAccessor, allBindings, data) {
        var handler = function (data, event) {
            if (event.keyCode === 13) {
                valueAccessor().call(data, data, event);
            }
        };

        var newValueAccessor = function () {
            return { keyup: handler };
        };

        ko.bindingHandlers.event.init(element, newValueAccessor, allBindings, data);
    }
};

//** ** ** Custom Binding - Tooltip ** ** **
ko.bindingHandlers.tooltip = {
    //init: function (element, valueAccessor) {
    //    var value = ko.utils.unwrapObservable(valueAccessor());
    //    $(element).tooltip({title: value});
    //}
    //init: function (element, valueAccessor) {
    //    var options = {
    //        title: ko.utils.unwrapObservable(valueAccessor())
    //    };

    //    ko.utils.extend(options, ko.bindingHandlers.tooltip.options)
    //    $(element).tooltip(options);
    //},
    //options: {
    //    placement: "right",
    //    trigger: "click"
    //}
    init: function (element, valueAccessor) {
        //we may put som options from the HTML and the code below allow to replace the default options with the specified in the HTML

        var local = ko.utils.unwrapObservable(valueAccessor()),
            options = {};

        ko.utils.extend(options, ko.bindingHandlers.tooltip.options)
        ko.utils.extend(options, local);

        $(element).tooltip(options);

        //tooltip cleanup
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).tooltip("destroy");
        });
    },
    options: {
        trigger: "hover"
    }
};


//****************************************************************
//************* JAVASCRIPT - Extending Observables ***************
//****************************************************************

ko.observable.fn.maxLength = function(maxLength, message) {
    var original = this,
		hasError = ko.observable(),
		result = ko.computed({
		    read: original,
		    write: function(newValue) {
		        hasError(newValue && newValue.length > maxLength);
		        original(newValue);
		    }
		});
		
    result(this());
    result.hasError = hasError;
    result.message = message || "Too long!";
	
    return result;
};

var extendObservableModel = function() {
    this.userName = ko.observable("julie1").maxLength(10, "Way too long!");
    this.hasError = ko.observable(false);
}


//****************************************************************
//************* JAVASCRIPT - Extending Observables, Mapping array data ***************
//****************************************************************

ko.observableArray.fn.map = function (data, Constructor) {
    var mapped = ko.utils.arrayMap(data, function (item) {
        return new Constructor(item);
    });

    this(mapped);

    return this;
}

var client = function (data) {
    this.userName = ko.observable(data.userName);
    this.name = ko.observable(data.name);
}

var clientsFromServer = [
    { userName: "bob_smith", name: "Bob Smith" },
    { userName: "tjones", name: "Ted Jones" },
    { userName: "susant", name: "Sue Thomas" }
];

//Setting Focus to an element
ko.observable.fn.focusable = function (val) {
    this.focused = ko.observable(val);
    return this;
};

var Product = function (data) {
    this.productCode = ko.observable(data.productCode).focusable();
    this.description = ko.observable(data.description);
}

var extendObservableClientModel = function (clients) {
    this.clients = ko.observableArray().map(clients, client);

    this.products = ko.observableArray(),
    this.addProduct = function () {
        var newProduct = new Product({});
        this.products.push(newProduct);

        newProduct.productCode.focused(true);
    };
};