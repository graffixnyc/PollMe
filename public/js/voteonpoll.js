
(function ($) {
    // Let's start writing AJAX calls!
    
    var voteForm = $("#vote-on-poll"),
        ansChoice1 = document.getElementById("choice1"),
        ansChoice2 = document.getElementById("choice2"),
        ansChoice3 = document.getElementById("choice3"),
        ansChoice4 = document.getElementById("choice4"),
        pollid = $("#pollid"),
        userid = $("#userid"),
        gender = $("#gender");
    
    voteForm.submit(function (event) {
        event.preventDefault();    
        
        var c1 = 0; 
        var c2 = 0;
        var c3 = 0;
        var c4 = 0;
        if(ansChoice1.checked)
            c1 = 1;
        else if(ansChoice2.checked)
            c2 = 1;
        else if(ansChoice3.checked)
            c3 = 1;
        else if(ansChoice4.checked)
            c4 = 1;
        
        var requestConfig = {
            method: "POST",
            url: "/voteonpoll",
            contentType: 'application/json',
            data: JSON.stringify({
                ansChoice1: c1,
                ansChoice2: c2,
                ansChoice3: c3,
                ansChoice4: c4,
                pollId: pollid.val(),
                userId: userid.val(),
                gender: gender.val()
            })
        };

        $.ajax(requestConfig);
        
        $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage);
            if(responseMessage.success === true) {
                var newWindow = window.open("/poll/" + responseMessage.pollid, "_self");
                return;
            }
            else {
                if(responseMessage.login === true)
                    var newWindow = window.open("/login", "_self");
                return;
            }
        });

    });
})(window.jQuery);