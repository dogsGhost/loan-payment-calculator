<?php
	include_once('classes/Calculation.php');
	$Calculation = new Calculation();
	
	if (isset($_POST['submit'])) {
		$Calculation->init();
	}
?>

<!DOCTYPE html>
<!--[if lte IE 9]> <html class="ie" lang="en"> <![endif]-->
<!--[if gt IE 9]><!--> <html lang="en"> <!--<![endif]-->
<head>
<meta charset="utf-8">
<title>Loan Payment Calculator</title>
<meta name="viewport" content="width=device-width">
<link href="css/style.css" rel="stylesheet">
</head>
<body> 
<div class="wrapper">
	<div class="header section" role="banner">
		<h1 class="heading">Loan Calculator</h1>
	</div>
	<div class="section main-section" role="main">
		<h2 class="heading">Instructions</h2>
		<ul>
			<li>This calculator outputs the monthly payments for a loan.</li>
			<li>The loan amount is the total amount of money you are borrowing and must be a whole number greater than zero.
				Do not enter commas, <abbr title="for example">e.g.</abbr>, 1,000 would be entered as 1000.</li>
			<li>Interest is the interest rate you are paying, this is a decimal or whole number greater than 0.1;
				do not include the percent sign.</li>
			<li>The number of months is how many months the loan will be carried out. This is a whole number greater than zero.</li>
		</ul>
		<form method="post" id="loanCalcForm" role="">
			<fieldset>
				<legend>Loan Calculator</legend>
					<ul>
						<li>
							<label for="loanAmount">Loan Amount</label>
							<input type="text" size="8" name="loanAmount" id="loanAmount" value="<?php if (isset($loanAmount)) { echo $loanAmount; } ?>" />
							<?php if (isset($errorArray[0])) { echo $errorArray[0]; } ?>
						</li>
						<li>
							<label for="interest">Interest</label>
							<input type="text" size="8" name="interest" id="interest" value="<?php if (isset($interest)) { echo $interest; } ?>" />
							<?php if (isset($errorArray[1])) { echo $errorArray[1]; } ?>
						</li>
						<li>
							<label for="numOfMonths">Number of Months</label>
							<input type="text" size="8" name="numOfMonths" id="numOfMonths" value="<?php if (isset($numOfMonths)) { echo $numOfMonths; } ?>" />
							<?php if (isset($errorArray[2])) { echo $errorArray[2]; } ?>
						</li>
					</ul>
					<input type="submit" name="submit" value="Submit" class="button" />
			</fieldset>
		</form>
		<div id="result" class="result">
			<?php if (isset($result)) { echo $result; } ?>
		</div>
		<div class="footer">
			<small>2012 | <a href="http://davwilh.com/">David made this</a></small>
		</div>
	</div> <!-- end /main-section -->
</div> <!-- end /wrapper -->
<script src="js/Utils.js"></script>
<script src="js/loanCalc.js"></script>
</body>
</html>