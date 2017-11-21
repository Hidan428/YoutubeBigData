var nextPageToken = null;
var previousPageToken = null;
var currentPageToken;
var maxResults = 15;

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
                                var chaine = '<div id="nbVid"> Environ ' + totalResult + ' résultats</div>';
                                for (var i = 0 ; i < vidId.length ; i++)
                                {

                                    chaine += '<a class="lienVid" href ="https://www.youtube.com/watch?v=' + vidId[i] + '"><div class="vid"><div class="imgVid"><img id="thumb" class="vidImg" src="' + vidThumburl[i] + '" alt="No  Image Available." style="width:120px;height:90px"><span class="duree">';
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
                                        chaine += '0' + vidSecond[i] + '</span></img></div>';
                                    }
                                    else{
                                        chaine += vidSecond[i] + '</span></img></div>';
                                    }
                                    chaine += '<div class="titre">' + vidTitle[i] + ' </div>';
                                    chaine += '<div class="auteur">' + vidCreator[i] + ' &middot; ' + vidCount[i] + ' vues &middot; Publiée le : ' + vidDay[i] + '/' +  vidMonth[i] + '/' + vidYear[i] + '</div>';
                                    chaine += '<div class="description">' + vidDescription[i] + '</div></div></a>';

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
                                var chaine = '<div id="nbVid"> Environ ' + totalResult + ' résultats</div>';
                                for (var i = 0 ; i < vidId.length ; i++)
                                {

                                    chaine += '<a class="lienVid" href ="https://www.youtube.com/watch?v=' + vidId[i] + '"><div class="vid"><div class="imgVid"><img id="thumb" class="vidImg" src="' + vidThumburl[i] + '" alt="No  Image Available." style="width:120px;height:90px"><span class="duree">';
                                    if(vidHeure[i]!=0)
                                    {
                                        chaine += vidHeure[i] + ':';
                                    }
                                    if(vidMinute[i] !=0)
                                    {
                                        chaine += vidMinute[i] + ':';
                                    }
                                    chaine += vidSecond[i] + '</span></img></div>';
                                    chaine += '<div class="titre">' + vidTitle[i] + ' </div>';
                                    chaine += '<div class="auteur">' + vidCreator[i] + ' &middot; ' + vidCount[i] + ' vues &middot; Publiée le : ' + vidDay[i] + '/' +  vidMonth[i] + '/' + vidYear[i] + '</div>';
                                    chaine += '<div class="description">' + vidDescription[i] + '</div></div></a>';
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
    allVid(recherche);
    console.log("Fini");
}
var compteur = 0;
function allVid(recherche){
    var totalResult;
    var vidCreator = [];

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
                        currentPageToken = data.nextPageToken;
                    }
                    else {
                        currentPageToken = '';
                        fini = 1;
                    }       
                    compteur += 1;
                    console.log("Compteur : " + compteur);             
                    $.each(srchItems, function(index, item) {              
                        vidCreator.push(item.snippet.channelTitle);
                    })
                 }
            });
            }
    if(currentPageToken != '')
    {
        self.getVid(recherche,50,currentPageToken).then(function(data){
            allVid();
        });
    }
}

function getCommentThread(id) {
// Champs a recuperer, dans des tableaux
    var comments[];
    var commentsId[];
    var commentAuthor[];
    var likes[];
    var publicationDate[];
    var updateDate[];

    self.getVid = function(recherche, maxResults, pageToken, id){
                return $.ajax({
                async: true,
                type: 'GET',
                url: 'https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=' + vidId[id] + '&key=AIzaSyC6rNYbiqYf7paJVuJbFGYK0absPmcVPSs',
                success: function(data) {
                    var srchItems = data.items;
                    $.each(srchItems, function(index, item) {
                        comments.push(item.snippet.topLevelComment.snippet.textOriginal);
                        commentsId.push(item.id);
                        commentAuthor.push(item.snippet.topLevelComment.snippet.authorDisplayName);
                        likes.push(item.snippet.topLevelComment.snippet.likeCount);                
                        publicationDate.push(item.snippet.topLevelComment.snippet.publishedAt);
                        updateDate.push(item.snippet.topLevelComment.snippet.updatedAt);
                    })
                 }
            });
            }
}