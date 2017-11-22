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
function start(recherche,pageToken)
{
    getParameter(false);
    keyWordsearch(recherche,pageToken);
    console.log("ici");
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
                                console.log(displayTitle);
                                var chaine = '<div id="nbVid"> Environ ' + totalResult + ' résultats</div>';
                                for (var i = 0 ; i < vidId.length ; i++)
                                {

                                    chaine += '<a class="lienVid" href ="https://www.youtube.com/watch?v=' + vidId[i] + '"><div class="vid"><div class="imgVid"><img id="thumb" class="vidImg" src="' + vidThumburl[i] + '" alt="No  Image Available." style="width:120px;height:90px">';
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
                                    chaine += '</div></a>';
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

                                    chaine += '<a class="lienVid" href ="https://www.youtube.com/watch?v=' + vidId[i] + '"><div class="vid"><div class="imgVid"><img id="thumb" class="vidImg" src="' + vidThumburl[i] + '" alt="No  Image Available." style="width:120px;height:90px">';
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
                                    chaine += '</div></a>';
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
            url : "http://kevin.wilst.etu.perso.luminy.univ-amu.fr/config.txt",
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
            url : "http://kevin.wilst.etu.perso.luminy.univ-amu.fr/config.txt",
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
            url: 'http://kevin.wilst.etu.perso.luminy.univ-amu.fr/write.php', 
            data: {'donnee': data},
            success : function(data) {
            },
            error : function(data){
                window.location.reload();
            }
    });
}