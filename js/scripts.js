var nextPageToken = null;
var previousPageToken = null;
var currentPageToken;
var maxResults = 50;
var compteur = 0;
var displayDuration;
var displayTitle;
var displayAutor;
var displayCount;
var displayPublish;
var displayDescription;
var response ;

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function subDateYear(chaine)
    {
        return chaine.substring(0,4);
    }
function subDateMonth(chaine)
    {
        return chaine.substring(5,7);
    }
function subDateDay(chaine)
    {
        return chaine.substring(8,10);
    }

// 
function keyWordsearch(recherche,pageToken){
            $('#active2').attr('id','');
            $('#l' + recherche.replace(/\s/g, '')).find('a').attr('id','active2');
            var totalResult;
            var vidTitle = [];
            var vidId = [];
            var vidThumburl = [];
            var vidThumbimg = [];
            var vidDescription = [];
            var vidCreator = [];
            var vidCount = [];
            var vidDay = [];
            var vidMonth = [];
            var vidYear = [];
            var vidHeure = [];
            var vidMinute = [];
            var vidSecond = [];
            var token = 0;
            
            
            self.getVid = function(recherche,maxResults,pageToken){
                return $.ajax({
                async: true,
                type: 'GET',
                url: 'https://www.googleapis.com/youtube/v3/search?pageToken=' + pageToken + '&part=snippet&q=' + recherche + '&maxResults=' + maxResults + '&relevanceLanguage=fr&key=AIzaSyC6rNYbiqYf7paJVuJbFGYK0absPmcVPSs',
                success: function(data) {
                    $('#content').empty();
                    var srchItems = data.items;
                    totalResult = data.pageInfo.totalResults;
                    if(data.nextPageToken)
                    {
                        nextPageToken = data.nextPageToken;
                    }
                    else{
                        nextPageToken = null;
                    }
                    if (data.prevPageToken)
                    {
                        previousPageToken = data.prevPageToken;
                    }
                    else{
                        previousPageToken = null;
                    }
                    
                    $.each(srchItems, function(index, item) {
                        vidTitle.push(item.snippet.title);
                        vidId.push(item.id.videoId);
                        vidThumburl.push(item.snippet.thumbnails.default.url);                
                        vidCreator.push(item.snippet.channelTitle);
                        vidDescription.push(item.snippet.description);
                        vidYear.push(subDateYear(item.snippet.publishedAt));
                        vidMonth.push(subDateMonth(item.snippet.publishedAt));
                        vidDay.push(subDateDay(item.snippet.publishedAt));

                    })
                 }
            });
            }

            self.getView = function(vidId){
                return $.ajax({
                async: true,
                type: 'GET',
                url: 'https://www.googleapis.com/youtube/v3/videos?part=statistics&id=' + vidId  + '&key=AIzaSyC6rNYbiqYf7paJVuJbFGYK0absPmcVPSs',
                success: function(data) {
                    
                    var srchItems = data.items;
                    $.each(srchItems, function(index, item) {
                        vidCount.push(item.statistics.viewCount);
                    })
                    token +=1;
                }
            });
            }

            self.getDuration = function(vidId){
                return  $.ajax({
                async: true,
                type: 'GET',
                url: 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=' + vidId  + '&key=AIzaSyC6rNYbiqYf7paJVuJbFGYK0absPmcVPSs',
                success: function(data) {
                    var srchItems = data.items;
                    $.each(srchItems, function(index, item) {
                        var match = item.contentDetails.duration.match(/P((([0-9]*\.?[0-9]*)Y)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)W)?(([0-9]*\.?[0-9]*)D)?)?(T(([0-9]*\.?[0-9]*)H)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)S)?)?/);
                        if(match[12])
                        {
                            vidHeure.push(match[12]);
                        }
                        else{
                            vidHeure.push(0);
                        }
                        if(match[14])
                        {
                            vidMinute.push(match[14]);
                        }
                        else{
                            vidMinute.push(0);
                        }
                        if (match[16])
                        {
                            vidSecond.push(match[16]);
                        }
                        else{
                            vidSecond.push(0);
                        }

                    })
                    token +=1;

                }
                });
            }
            setToken(pageToken);
            self.getVid(recherche,maxResults,currentPageToken).then(function(data){
                for (var i = 0 ; i < vidId.length ; i++)
                {
                    self.getView(vidId[i]).then(function(data){
                            if(token == (maxResults*2))
                            {
                                console.log("after");
                                var chaine = '<div id="nbVid"> Environ ' + totalResult + ' résultats</div>';
                                for (var i = 0 ; i < vidId.length ; i++)
                                {
                                    chaine += '<div class="vidComment">';
                                    chaine += '<button class="commentButton" type="button" onClick=\'openCommentThread("'+vidId[i]+'");\'> Voir les commentaires </button> ';
                                    chaine += '<a class="lienVid" onclick=\'addVidCount("' + recherche + '");\' target="_blank" href ="https://www.youtube.com/watch?v=' + vidId[i] + '"><div class="vid"><div class="imgVid"><img id="thumb" class="vidImg" src="' + vidThumburl[i] + '" alt="No  Image Available." style="width:120px;height:90px">';
                                    if(displayDuration == true){
                                        chaine += '<span class="duree">';
                                        if(vidHeure[i]!=0)
                                        {
                                            chaine += vidHeure[i] + ':';
                                        }
                                        if(vidMinute[i] !=0)
                                        {
                                            if(vidHeure[i]!=0 && vidMinute[i]<10)
                                            {
                                                chaine += '0' + vidMinute[i] + ':';
                                            }
                                            else{
                                                chaine += vidMinute[i] + ':';
                                            }
                                        }
                                        if(vidSecond[i]<10)
                                        {
                                            chaine += '0' + vidSecond[i] + '</span>';
                                        }
                                        else{
                                            chaine += vidSecond[i] + '</span>';
                                        }
                                    }
                                    chaine += '</img></div>';
                                    if(displayTitle == true)
                                    {
                                        chaine += '<div class="titre">' + vidTitle[i] + ' </div>';
                                    }
                                    chaine += '<div class="auteur">';
                                    if(displayAutor == true)
                                    {
                                        chaine += vidCreator[i];

                                    }
                                    if (displayCount == true)
                                    {
                                        chaine += ' &middot; ' + vidCount[i] + ' vues &middot;';
                                    }
                                    if (displayPublish == true)
                                    {
                                        chaine += ' Publiée le : ' + vidDay[i] + '/' +  vidMonth[i] + '/' + vidYear[i] ;
                                    }
                                    chaine += '</div>';
                                    if(displayDescription == true)
                                    {
                                        chaine += '<div class="description">' + vidDescription[i] + '</div>';
                                    }
                                    chaine += '</div></a></div>';
                                }
                                chaine += '<div id="buttons">';
                                if(previousPageToken)
                                {
                                    chaine += '<button id="botPrevButton" type="button" onClick =\'keyWordsearch("' + recherche + '",-1);\'>Previous</button>';
                                }
                                if(nextPageToken)
                                {
                                    chaine += '<button id="botNextButton" type="button" onClick =\'keyWordsearch("' + recherche + '",1);\'>Next</button>';
                                }
                                chaine += '</div>';
                                $('#content').append(chaine);
                            }
                    });
                    self.getDuration(vidId[i]).then(function(data){
                            if(token == (maxResults*2))
                            {
                                console.log(displayTitle);
                                var chaine = '<div id="nbVid"> Environ ' + totalResult + ' résultats</div>';
                                for (var i = 0 ; i < vidId.length ; i++)
                                {
                                    chaine += '<div class="vidComment">';
                                    chaine += '<button class="commentButton" type="button" onClick=\'openCommentThread("'+vidId[i]+'");\'> Voir les commentaires </button> ';
                                    chaine += '<a class="lienVid" onclick=\'addVidCount("' + recherche + '");\' target="_blank" href ="https://www.youtube.com/watch?v=' + vidId[i] + '"><div class="vid"><div class="imgVid"><img id="thumb" class="vidImg" src="' + vidThumburl[i] + '" alt="No  Image Available." style="width:120px;height:90px">';
                                    if(displayDuration == true){
                                        chaine += '<span class="duree">';
                                        if(vidHeure[i]!=0)
                                        {
                                            chaine += vidHeure[i] + ':';
                                        }
                                        if(vidMinute[i] !=0)
                                        {
                                            if(vidHeure[i]!=0 && vidMinute[i]<10)
                                            {
                                                chaine += '0' + vidMinute[i] + ':';
                                            }
                                            else{
                                                chaine += vidMinute[i] + ':';
                                            }
                                        }
                                        if(vidSecond[i]<10)
                                        {
                                            chaine += '0' + vidSecond[i] + '</span>';
                                        }
                                        else{
                                            chaine += vidSecond[i] + '</span>';
                                        }
                                    }
                                    chaine += '</img></div>';
                                    if(displayTitle == true)
                                    {
                                        chaine += '<div class="titre">' + vidTitle[i] + ' </div>';
                                    }
                                    chaine += '<div class="auteur">';
                                    if(displayAutor == true)
                                    {
                                        chaine += vidCreator[i];

                                    }
                                    if (displayCount == true)
                                    {
                                        chaine += ' &middot; ' + vidCount[i] + ' vues &middot;';
                                    }
                                    if (displayPublish == true)
                                    {
                                        chaine += ' Publiée le : ' + vidDay[i] + '/' +  vidMonth[i] + '/' + vidYear[i] ;
                                    }
                                    chaine += '</div>';
                                    if(displayDescription == true)
                                    {
                                        chaine += '<div class="description">' + vidDescription[i] + '</div>';
                                    }
                                    chaine += '</div></a></div>';
                                }
                                chaine += '<div id="buttons">';
                                if(previousPageToken)
                                {
                                    chaine += '<button id="botPrevButton" type="button" onClick =\'keyWordsearch("' + recherche + '",-1);\'>Previous</button>';
                                }
                                if(nextPageToken)
                                {
                                    chaine += '<button id="botNextButton" type="button" onClick =\'keyWordsearch("' + recherche + '",1);\'>Next</button>';
                                }
                                chaine += '</div>';
                                $('#content').append(chaine);
                            }
                        });
                }
            });
                   /* */
}

function setToken(pageToken)
{
    if(pageToken  == 0)
    {
        currentPageToken = ' ';
    }
    else if(pageToken == 1 )
    {
        currentPageToken = nextPageToken;
    }
    else
    {
        currentPageToken = previousPageToken;
    }
}

var fini = 0;
function autorSearch(){
    var recherche;
    
    if($('#lBigData').find('a').attr('id') == "active2")
    {
        recherche = "Big Data";
    }
    if($('#lModelisation3D').find('a').attr('id') == "active2")
    {
        recherche = "Modelisation 3D";
    }
    if($('#lAnalysedimage').find('a').attr('id') == "active2")
    {
        recherche = "Analyse d'image";
    }
    if($('#lMondesvirtuels').find('a').attr('id') == "active2")
    {
        recherche = "Mondes Virtuels";
    }
    if($('#lLabyrinthe').find('a').attr('id') == "active2")
    {
        recherche = "Labyrinthe";
    }

    var tableau = [];
    compteur = 0;
    var vidCreator = [];
    var x=0;
    allVid(recherche,vidCreator,x);
    console.log("Fini");
}



function allVid(recherche,vidCreator,x){
    var totalResult;
    self.getVid = function(recherche,maxResults,pageToken){
                return $.ajax({
                async: true,
                type: 'GET',
                url: 'https://www.googleapis.com/youtube/v3/search?pageToken=' + pageToken + '&part=snippet&q=' + recherche + '&maxResults=' + maxResults + '&relevanceLanguage=fr&key=AIzaSyC6rNYbiqYf7paJVuJbFGYK0absPmcVPSs',
                success: function(data) {
                    $('#content').empty();
                    var srchItems = data.items;
                    totalResult = data.pageInfo.totalResults;
                    if(data.nextPageToken)
                    {
                        console.log(data.nextPageToken);

                        currentPageToken = data.nextPageToken;
                    }
                    else {
                        currentPageToken = '';
                        fini = 1;
                    }       
                    compteur += 1;
                    x=0;
                    console.log("Compteur : " + compteur);             
                    $.each(srchItems, function(index, item) {              
                        vidCreator.push(item.snippet.channelTitle);
                        x +=1;
                    })
                    console.log(x);
                 }
            });
            }
    if(currentPageToken != '')
    {
        self.getVid(recherche,50,currentPageToken).then(function(data){
            if(compteur ==20)
            {
                console.log(vidCreator);
                console.log(x);
                
                triAutor(vidCreator);
            }
            allVid(recherche,vidCreator,x);
        });
    }
}

function triAutor(listeAutor)
{
    $('#content').empty();
    var i=0;
    var j=i;
    var nombreAutor =[];
    var nbAut;
    console.log("ici");
    console.log(listeAutor[i]);
    while(listeAutor[i]!=null)
    {
        console.log("ici");
        nbAut=1;
        j=i+1;
        while(listeAutor[j])
        {
            if(listeAutor[i]==listeAutor[j])
            {
                listeAutor.splice(j,1);
                nbAut +=1;
            }
            else{
                j++;
            }
        }
        i++;
    }
    console.log(listeAutor);
}

function getParameter(display)
{
    self.getParam = function(){
        return $.ajax({
            url : "./config.txt",
            dataType: "text",
            success : function (data) {
            }
        });
    }
    self.getParam().then(function(data){
        
        var i = 0;
        var chaine = '<div id="titreParam"> Affichage </div> <div id = "params">';
        var value;
        var param;
        while(data.substring(i,i+1))
        {
            value = '';
            param = '';
            while(data.substring(i,i+1) != " " || data.substring(i+1,i+2) != "=")
            {
                param += data.substring(i,i+1);
                i++;
            }
            i += 3;
            while(data.substring(i,i+1) != '\n')
            {
                value += data.substring(i,i+1);
                i++;
            }

            chaine += '<div class = "param">' + param + '<input id = "' + param + '" type="checkbox" ';
            if (value == 1)
            {
                chaine += 'checked>'
            }
            else{
                chaine += '>';
            }
            chaine += '</div>';
            i++;
            if(param == "titre")
            {
                if(value == 1)
                {
                    displayTitle = true;

                }
                else
                {
                    displayTitle = false;
                }
            }
            else if(param == "nom")
            {
                if(value == 1)
                {
                    displayAutor = true;
                }
                else
                {
                    displayAutor = false;
                }
            }
            else if (param == "duree")
            {
                if(value == 1)
                {
                    displayDuration = true;
                }
                else
                {
                    displayDuration = false;
                }
            }
            else if (param == "nombre de vues")
            {
                if(value == 1)
                {
                    displayCount = true;
                }
                else
                {
                    displayCount = false;
                }
            }
            else if (param == "date de publication")
            {
                if(value == 1)
                {
                    displayPublish = true;
                }
                else
                {
                    displayPublish = false;
                }
            }
            else if (param == "description")
            {
                if(value == 1)
                {
                    displayDescription = true;
                }
                else
                {
                    displayDescription = false;
                }
            }
        }
        console.log("before");
        chaine += '</div>';
        chaine += '<button id="save" type="button" onClick =\'saveParam();\'>Enregistrer</button>';

        if(display == true)
        {
            $('#content').empty();
            $('#content').append(chaine);
        }
    });
}


function saveParam()
{
    self.getParam = function(){
        return $.ajax({
            url : "./config.txt",
            dataType: "text",
            success : function (data) {
            }
        });
    }

    self.getParam().then(function(data){

        var i = 0;
        var param;
        var value;
        while(data.substring(i,i+1))
        {
            value = false;
            param = '';
            while(data.substring(i,i+1) != " " || data.substring(i+1,i+2) != "=")
            {
                param += data.substring(i,i+1);
                i++;
            }
            if(document.getElementById(param).checked == true)
            {
                value = true;
            }
            i += 3;
            while(data.substring(i,i+1) != '\n')
            {
                if(value == false)
                {
                    data = data.substr(0, i) + '0' + data.substr(i +1);
                }
                else
                {
                    data = data.substr(0, i) + '1' + data.substr(i +1);
                }
                
                i++;
            }
            i++;
        }
        writeOnConfig(data);
    });

    
}

function writeOnConfig(data)
{
    $.ajax({  
            type: 'POST',
            dataType: 'json',  
            url: './write.php', 
            data: {'donnee': data},
            success : function(data) {
            },
            error : function(data){
                window.location.reload(true);
            }
    });

}


function setQuizz()
{
    self.getQuizz = function(){
        return $.ajax({
            url : "./quizz.txt",
            dataType: "text",
            success : function (data) {
            }
        });
    }

    self.getQuizz().then(function(data){
        response = 0;
        let question;
        let reponse;
        let chaine = '<div id="responses">' + response + ' bonnes reponses </div>';
        let i = 0;
        let j =1;
        while(data.substring(i,i+1))
        {
            question = '';
            chaine += '<div class = "questions">';
            while(data.substring(i,i+1) != "?")
            {
                if (data.substring(i,i+1) != '\\')
                {
                    question += data.substring(i,i+1);
                }
                else{
                    question += data.substring(i+1,i+2);
                    i++;
                }
                i++;
            }
            chaine += '<div class ="question" >' + question  + '</div>';
            i++;
            while (data.substring(i,i+1) != ';')
            {
                reponse = '';
                while(data.substring(i,i+1) != '%' && data.substring(i,i+1) != '!')
                {
                    reponse += data.substring(i,i+1);
                    i++;
                }
                if(data.substring(i,i+1) == '%')
                {
                    chaine += '<div class="reponseF' + j + '"><input type="radio" class="' + j + '" onClick =\'countResponse(' + false + ',' + j + ');\'>' + reponse + '</div>';
                }
                else{
                    chaine += '<div class="reponseV' + j + '"><input type="radio" class="' + j + '" onClick =\'countResponse(' + true + ',' + j + ');\'>' + reponse + '</div>';
                }
                i++;
            }
            chaine += '</div>';
            j++;
            i++;
        }
        $('#content').empty();
        $('#content').append(chaine);
    });
}

function countResponse(value , name)
{
    if(value == true)
    {
        response += 1;
        $('#responses').text(response + ' bonnes reponses');
    }
    $('.reponseV' + name).css({'color' : 'green'});
    $('.reponseF' + name).css({'color' : 'red'});
    let check=document.getElementsByClassName(name);
    for (let i = 0 ; i<check.length;i++)
    {
        check[i].disabled = true;
    }
}

function start(recherche,pageToken)
{
    getParameter(false);
    keyWordsearch(recherche,pageToken);
}

function addVidCount(recherche)
{
    if(getCookie(recherche)=="")
    {
        setCookie(recherche,1,10);
    }
    else
    {
        let value = Number(getCookie(recherche));
        setCookie(recherche,value+1,10);
        if(value>5 && value%5 == 0)
        {
            wouldYouQuizz(recherche);
        }
    }
}

function wouldYouQuizz(recherche)
{
    let chaine ="";
    chaine += '<div id=page></div>'
    chaine += '<div id="popUp">Voulez-vous faire un Quizz sur :' + recherche + '?<br>' ;
    chaine += '<button id="Oui" type="button">Oui</button> <button id="Non" type="button">Non</button>';
    chaine += '</div>';

    $('#content').append(chaine);
    $('#popUp').css('display','block');
    $('#popUp').css('position','fixed');
    $('#popUp').css('height','15vh');
    $('#popUp').css('width','30vw');
    $('#popUp').css('top','45vh');
    $('#popUp').css('left','35vw');
    $('#popUp').css('z-index','3');
    $('#popUp').css('text-align','center');
    $('#popUp').css('background-color','#c4302b');
    $('#popUp').css('color','white');
    $('#popUp').css('font-family' ,' Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif');
    $('#popUp').css('border-radius' ,' 8px');
    $('#popUp').css('border' ,' none');
    $('#popUp').css('font-size', '4vh');
    $('#Oui').css('font-family',' Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif');
    $('#Oui').css('border-radius',' 8px');
    $('#Oui').css('background-color',' #c4302b');
    $('#Oui').css('padding',' 15px 32px');
    $('#Oui').css('border',' none;')
    $('#Oui').css('text-align',' center');
    $('#Oui').css('display',' inline-block');
    $('#Oui').css('color','white');
    $('#Oui').css('font-size', '3vh');
    $('#Non').css('font-family',' Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif');
    $('#Non').css('border-radius',' 8px');
    $('#Non').css('background-color',' #c4302b');
    $('#Non').css('padding',' 15px 32px');
    $('#Non').css('border',' none;')
    $('#Non').css('text-align',' center');
    $('#Non').css('display',' inline-block');
    $('#Non').css('color','white');
    $('#Non').css('font-size', '3vh');
    $('#page').css('position','fixed');
    $('#page').css('height','100vh');
    $('#page').css('width','100vw');
    $('#page').css('top','0vh');
    $('#page').css('left','0vw');
    $('#page').css('z-index','2');
    $('#page').css('background-color','rgba(255,255,255, 0.5)');
}

function logPage()
{
    let chaine ="";
    $.get("./loged",(data) =>{
        if(data=='done')          
            {
                chaine += '<input type="text" size="40" placeholder="Type your email" id="email"><br />';
                chaine += '<input type="password" size="40" placeholder="Type your password" id="password"><br />';
                chaine += '<input type="button" value="Submit" id="submit" onClick=\'loginPage()\'>';
            }
            else if (data == 'Already')
            {
                chaine += 'Already Connected';
                chaine += '<input type="button" value="Logout" id="logout" onClick=\'logoutPage()\'>';
            }
            $('#content').empty()
            $('#content').append(chaine)
    });
}

function loginPage()
{
    let email = $('#email').val();
    let pass = $('#password').val();
    $.post("./login",{email:email,pass:pass},(data) =>{
        logPage();
    });
}

function logoutPage()
{
    $.get("./logout",(data) =>{
        
        logPage();

    });
}