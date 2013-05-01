<?php

class Calculation {
	private $error = false;

	public function init() {
	    global $errorArray, $loanAmount, $interest, $numOfMonths, $result;

	    $errorArray = array();
	    $monthlyPayment = 0;
	    $result = '';
	    // Trim to elimate any extra whitespace before validating.
	    $loanAmount = trim($_POST['loanAmount']);
	    $interest = trim($_POST['interest']);
	    $numOfMonths = trim($_POST['numOfMonths']);
	    
	    $errorArray[0] = $this->checkWholeNum($loanAmount);
	    $errorArray[1] = $this->checkInterest($interest);
	    $errorArray[2] = $this->checkWholeNum($numOfMonths);

	    if (!$this->getError()) {
	    	$rate = $interest / 1200;
	    	$rate = round($rate, 7);

	    	$monthlyPayment = ($rate + $rate / (pow($rate + 1, $numOfMonths) - 1)) * $loanAmount;
			$monthlyPayment = round($monthlyPayment, 2);

	    	$result = 'Your monthly payment is $' . $monthlyPayment;
	    }
	}

	public function checkWholeNum($string) {
		$pattern = '/^[1-9][0-9]*$/';
		if (!preg_match($pattern, $string)) {
			$this->setError();
			return "<span class='error'> &larr; must be a whole number greater than zero</span>";
		} else {
			return '';
		}
	}

	public function checkInterest($string) {
		$pattern = '/^(?:[0]?\.[1-9]|[1-9]+[0-9]*\.[0-9])[0-9]*$|^[1-9][0-9]*$/';
		if (!preg_match($pattern, $string)) {
			$this->setError();
			return "<span class='error'> &larr; must be a number greater than .1</span>";
		} else {
			return '';
		}
	}

	public function getError() {
		return $this->error;
	}

	public function setError() {
		$this->error = true;
	}
}	