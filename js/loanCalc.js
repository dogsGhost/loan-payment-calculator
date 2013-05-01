/**
* @fileOverview Calculates payments on a loan including interest.
* @author David Wilhelm
* @version 2012.09.26
*/

(function () {
    'use strict';

    var loanCalc = {
        init: function () {
            this.trimCheck();
            this.cacheVariables();
            this.setInputs();
            this.bindElements();
        },
        trimCheck: function () {
            // Add trim method if it doesn't exist (fix for IE8 and below).
             if(!String.prototype.trim) {
                String.prototype.trim = function () {
                    return this.replace(/^\s+|\s+$/g,'');
                };
            }
        },
        cacheVariables: function () {
            this.loanCalcForm = document.getElementById('loanCalcForm');
            this.container = document.getElementById('result');
            this.inputArray = [];
            this.inputValArray = [];
            this.errorArray = [];
            this.inputErrors = false; // This is set true any time an input error is found.
        },
        // This puts all our text inputs from the form into this.inputArray for easy access
        setInputs: function () {
            var inputs = this.loanCalcForm.getElementsByTagName('input'),
                i, len = inputs.length;
            for (i = 0; i < len; i += 1) {
                if (inputs[i].type === 'text') {
                    this.inputArray.push(inputs[i]);
                }
            }
        },
        bindElements: function () {
            Utils.addEventListener(this.loanCalcForm, 'submit', this.validate);
        },
        validate: function (e) {
            Utils.preventDefault(e);

            // Reset some globals each time validate is called.
            loanCalc.inputValArray = [];
            loanCalc.errorArray = [];
            loanCalc.inputErrors = false;

            // Get the values from the inputs, trim them, then store them.
            var i, tmp, len = loanCalc.inputArray.length;
            for (i = 0; i < len; i += 1) {
                // tmp isn't really needed but helps outline the process.
                tmp = loanCalc.inputArray[i].value;
                tmp = tmp.trim();
                loanCalc.inputValArray.push(tmp);
            }

            // Clear the contents of the result container in case a previous payment has been calculated.
            loanCalc.container.innerHTML = '';

            // Run the proper checks on our input values and store the results in this.errorArray.
            len = loanCalc.inputValArray.length;
            for (i = 0; i < len; i += 1) {
                if (i === 1) {
                    loanCalc.errorArray.push( loanCalc.checkInterest(loanCalc.inputValArray[i]) );
                } else {
                    loanCalc.errorArray.push( loanCalc.checkWholeNum(loanCalc.inputValArray[i]) );
                }
            }

            // Remove any previous error messages and post any new ones.
            loanCalc.removeNotices();
            loanCalc.postErrors();

            // If no errors are found calculate the monthly payment.
            if (!loanCalc.inputErrors) {
                loanCalc.calculateLoan();
            }
        },
        checkInterest: function (value) {
            // Here's our regex followed by a breakdown.
            var pattern = /^(?:[0]?\.[1-9]|[1-9]+[0-9]*\.[0-9])[0-9]*$|^[1-9][0-9]*$/;
            /*
                /^(?:[0]?\.[1-9] = allows the string to optionally start with a zero as long as it is
                    followed by a period and a digit greater than zero.

                |[1-9]+[0-9]*\.[0-9]) = or checks that the string start with a number greater than zero,
                    followed by an optional number of digits, followed by a period and any digit.
                
                [0-9]*$ = allows for additional decimal places beyond the first by checking for zero
                    or more numbers at the end of the string.

                | = this is the or statement that allows for the period to be optional.

                ^[1-9] = checks that the string starts with a number greater than zero.
                
                [0-9]*$/ = checks for any number of digits at the end of the string.
            */

            // If the value fails the test, set the boolean and store our error message.
            if (pattern.test(value)) {
                return '';
            } else {
                this.inputErrors = true;
                return "\u2190 must be a number greater than or equal to .1!";
            }
        },
        checkWholeNum: function (value) {
            // This regex is the same as the second half of the regex used in this.checkInterest.
            // This structure prevents '0' from passing.
            var pattern = /^[1-9][0-9]*$/;

            if (pattern.test(value)) {
                return '';
            } else {
                this.inputErrors = true;
                return "\u2190 must be a whole number greater than zero!";
            }
        },
        // If there are any error messages displayed, this gets rid of them.
        removeNotices: function () {
            var i = this.inputArray.length;
            var spans = this.loanCalcForm.getElementsByTagName('span');
            if (spans.length) {
                while (i--) {
                    this.inputArray[i].parentNode.removeChild(spans[i]);
                }
            }
        },
        // Add error messages to the page.
        postErrors: function () {
            var span, i, string, len = this.errorArray.length;
            for (i = 0; i < len; i += 1) {
                // Create span, insert message from errorArray, and put it after the corresponding input.
                span = document.createElement('span');
                string = document.createTextNode(this.errorArray[i]);
                span.appendChild(string);
                span.className = 'error';
                this.inputArray[i].parentNode.appendChild(span);
            }
        },
        calculateLoan: function () {
            /*
                The formula we will be using is:
                rate = interest/1200
                monthly payment = (rate + (rate / (( (1 + rate)^months ) - 1)) * principal
                Note: '^' in the above equation represents months as an exponent of (1 + rate).
                It does not have the same meaning in javascript math.
            */

            var loanAmount = Number(this.inputValArray[0]),
                interest = Number(this.inputValArray[1]),
                numOfMonths = Number(this.inputValArray[2]),
                rate = interest / 1200,
                monthlyPayment = 0;

            // Use toFixed method to round rate. The toFixed method converts a number to a string,
            // so we use Number() to convert it back.
            rate = Number(rate.toFixed(7));

            // Substitute the proper variables into our equation to get the monthlyPayment value.
            monthlyPayment = (rate + rate / (Math.pow(rate + 1, numOfMonths) - 1)) * loanAmount;

            // Round the monthlyPayment to the second decimal place. We can leave it as a string.
            monthlyPayment = monthlyPayment.toFixed(2);

            this.container.innerHTML = 'Your monthly payment is $' + monthlyPayment;
        }
    };

    loanCalc.init();

}());