        var space = "";
        var speed = "150";
        var pos = 0;
        var msg = ".| Bienvenue sur le site d'Okaya [BC] |.";
        /*
         c'est un peut long à trouver à faire mais je suis fier et peu de site pense à ça big brain 
        */
        function Scroll() {
            document.title = msg.substring(pos, msg.length) + space + msg.substring(0, pos);
            pos++;
            if (pos > msg.length) pos = 0;
            window.setTimeout("Scroll()", speed);
        }
        Scroll(); 