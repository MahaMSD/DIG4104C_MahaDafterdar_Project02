/* ------------------------ history timeline ---------------------- */
//scrolling arrow
  $(window).scroll(function() {
    var scroll = $(window).scrollTop();
    if (scroll >= 1) {
      $('.arrow').addClass('fade');
    } else{
      $('.arrow').removeClass('fade');
    }
  })
  
// SMOOTH SCROLLING SECTIONS
$('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
        || location.hostname == this.hostname) {

        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
           if (target.length) {
             $('html,body').animate({
                 scrollTop: target.offset().top
            }, 1000);
            return false;
        }
    }
});

/* --- back to top button --- */
var $backToTop = $('.back-to-top');
$backToTop.hide();


$(window).on('scroll', function() {
  if ($(this).scrollTop() > 100) {
    $backToTop.fadeIn();
  } else {
    $backToTop.fadeOut();
  }
});

$backToTop.on('click', function(e) {
  $('html, body').animate({scrollTop: 0}, 500);
});

/* ------------------------ game quiz buzzfeed ---------------------- */
// Quiz result options in a separate object for flexibility
var resultOptions = [
    {   title: '1964 Ford Cobra',
        desc: '<p>Sophisticated, intelligent, and classy, you have a taste for the finer things in life. The 1964 Ford Cobra is a perfect ride for someone like you.</p>',
        resimg: '../images/1964.jpg'
    },
    {   title: '2017 Ford GT',
        desc: '<p>You’re a free spirit who loves the attention. You don’t always play by the rules, but neither does the 2017 Ford GT.</p>',
        resimg: '../images/1964.jpg'
    },
    {   title: '1936 Ford',
        desc: '<p>You’re a classy old soul, which is exactly why the 1936 Ford is perfect for you – with its iconic slick tailfins, chrome features, and overall classic beauty.</p>',
        resimg: '../images/1964.jpg'
    },
    {   title: '1932 Ford Highboy',
        desc: '<p>You deserve an era of adventure, and glory, and the 1932 Ford Highboy is just the perfect fit for you. Happy driving</p>',
        resimg: '../images/1964.jpg'
    },
    {   title: '1965 Ford Shelby GT350',
        desc: '<p>Many have said that the 1965 Shelby GT350 Fastback is the perfect car — so we can’t imagine a more perfect fit for you. Some people drive to get places, you drive to feel the thrill of the open road.</p>',
        resimg:'../images/1964.jpg'
    }
];
    
// global variables
var quizSteps = $('#quizzie .quiz-step'),
    totalScore = 0;

// for each step in the quiz, add the selected answer value to the total score
// if an answer has already been selected, subtract the previous value and update total score with the new selected answer value
// toggle a visual active state to show which option has been selected
quizSteps.each(function () {
    var currentStep = $(this),
        ansOpts = currentStep.children('.quiz-answer');
    // for each option per step, add a click listener
    // apply active class and calculate the total score
    ansOpts.each(function () {
        var eachOpt = $(this);
        eachOpt[0].addEventListener('click', check, false);
        function check() {
            var $this = $(this),
                value = $this.attr('data-quizIndex'),
                answerScore = parseInt(value);
            // check to see if an answer was previously selected
            if (currentStep.children('.active').length > 0) {
                var wasActive = currentStep.children('.active'),
                    oldScoreValue = wasActive.attr('data-quizIndex'),
                    oldScore = parseInt(oldScoreValue);
                // handle visual active state
                currentStep.children('.active').removeClass('active');
                $this.addClass('active');
                // handle the score calculation
                totalScore -= oldScoreValue;
                totalScore += answerScore;
                calcResults(totalScore);
            } else {
                // handle visual active state
                $this.addClass('active');
                // handle score calculation
                totalScore += answerScore;
                calcResults(totalScore);
                // handle current step
                updateStep(currentStep);
            }
        }
    });
});

// show current step/hide other steps
function updateStep(currentStep) {
    if(currentStep.hasClass('current')){
       currentStep.removeClass('current');
       currentStep.next().addClass('current');
    }
}

// display scoring results
function calcResults(totalScore) {
    // only update the results div if all questions have been answered
    if (quizSteps.find('.active').length == quizSteps.length){
        var resultsTitle = $('#results h4'),
            resultsDesc = $('#results .desc'),
            resultsImg = $('#results .resimg');
        
        // calc lowest possible score
        var lowestScoreArray = $('#quizzie .low-value').map(function() {
            return $(this).attr('data-quizIndex');
        });
        var minScore = 0;
        for (var i = 0; i < lowestScoreArray.length; i++) {
            minScore += lowestScoreArray[i] << 0;
        }
        // calculate highest possible score
        var highestScoreArray = $('#quizzie .high-value').map(function() {
            return $(this).attr('data-quizIndex');
        });
        var maxScore = 0;
        for (var i = 0; i < highestScoreArray.length; i++) {
            maxScore += highestScoreArray[i] << 0;
        }
        // calc range, number of possible results, and intervals between results
        var range = maxScore - minScore,
            numResults = resultOptions.length,
            interval = range / (numResults - 1),
            increment = '',
            n = 0; //increment index
        // incrementally increase the possible score, starting at the minScore, until totalScore falls into range. then match that increment index (number of times it took to get totalScore into range) and return the corresponding index results from resultOptions object
        while (n < numResults) {
            increment = minScore + (interval * n);
            if (totalScore <= increment) {
                // populate results
                resultsTitle.replaceWith('<h4>' + resultOptions[n].title + '</h4>');
                resultsDesc.replaceWith('<p class=\'desc\'>' + resultOptions[n].desc + '</p>');
                resultsImg.replaceWith('<img src=\'' + resultOptions[n].resimg + '\' alt=\'imgres\'>')
                return;
            } else {
                n++;
            }
        }
    }
}