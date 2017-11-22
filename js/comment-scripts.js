var nextPageToken = null;
var previousPageToken = null;
var currentPageToken;
maxResults = 50;

// Difference entre 2 dates en nombre de jours
function dayDiff(d1, d2) {
  d1 = d1.getTime() / 86400000;
  d2 = d2.getTime() / 86400000;
  return new Number(d1 - d2).toFixed(0);
}

compteur = 0;
fini = 0;
function getCommentThread(id, pageToken) {
// Champs a recuperer, dans des tableaux
    var comments=[];
    var commentsId=[];
    var commentsAuthor=[];
    var authorsAvatar=[];
    var likes=[];
    var publicationDate=[];
    var updateDate=[];
    var totalResult = 0;

// Effectue la requete
    self.getVid = function(id, maxResults, pageToken) {
            return $.ajax({
            async: true,
            type: 'GET',
            url: 'https://www.googleapis.com/youtube/v3/commentThreads?pageToken=' + pageToken + '&part=snippet&videoId=' + id + '&maxResults=' + maxResults +'&order=relevance&key=AIzaSyC6rNYbiqYf7paJVuJbFGYK0absPmcVPSs',
            success: function(data) {
                $('#content').empty();                             //Vider le contenu avant d'afficher les pages
                totalResult = data.pageInfo.totalResults;
                var srchItems = data.items;
                if(data.nextPageToken){
                    nextPageToken = data.nextPageToken;
                }
                else{
                    nextPageToken = null;
                }
                if (data.prevPageToken){
                    previousPageToken = data.prevPageToken;
                }
                else{
                    previousPageToken = null;
                } 

            // Recuperation des champs qui nous interessent
                $.each(srchItems, function(index, item) {
                    comments.push(item.snippet.topLevelComment.snippet.textOriginal);
                    commentsId.push(item.id);
                    commentsAuthor.push(item.snippet.topLevelComment.snippet.authorDisplayName);
                    authorsAvatar.push(item.snippet.topLevelComment.snippet.authorProfileImageUrl);
                    likes.push(item.snippet.topLevelComment.snippet.likeCount);                
                    publicationDate.push(item.snippet.topLevelComment.snippet.publishedAt);
                    updateDate.push(item.snippet.topLevelComment.snippet.updatedAt);
                })
             }
        });
    }

// Traitement apres recuperation des champs
        setToken(pageToken);
        self.getVid(id, 50, currentPageToken).then(function(data) {
            var chaine="";
            var now     = new Date();
            var annee   = now.getFullYear();
            var mois    = now.getMonth() + 1;
            var jour    = now.getDate();
            var heure   = now.getHours();
            var minute  = now.getMinutes();
            var seconde = now.getSeconds();
            var dateDiff;

            var isUpdated='';
            $('#content').append('<span class="numberOfComments">' + totalResult + ' commentaire(s)</span>');

            for (var i = 0 ; i < commentsId.length ; i++) {
                chaine += '<div class=comment>';
                chaine += '<div class="commentAvatar"><img src='+authorsAvatar[i]+'alt="No Image Available height=28 width=28></div>';
                chaine += ' <div class="commentContent"> <span class="commentAuthor" >' + commentsAuthor[i] + '</span>';
            
            // Si il y a eu modification du commentaire
                if( dayDiff(new Date(updateDate[i]), new Date(publicationDate[i])) != 0 )
                    isUpdated = ' (modifié)' ;
            
            // Compte en annee si nbJour > 365
                dateDiff = dayDiff(now, new Date(publicationDate[i]));
                if( dateDiff < 365 )
                    chaine += ' <span class="pubDate">il y a ' + dateDiff +' jour(s)'+ isUpdated + "</span>";
                else
                    chaine += ' <span class="pubDate">il y a ' + Math.round(dateDiff/365) +' an(s)'+ isUpdated + "</span>";

                chaine += '<p>' + comments[i] + '</p>';
                chaine += '<p> likes: ' + likes[i] + '</p>';     
                chaine += '</div></div>'
            }

            chaine += '<div id="buttons">';
            if(previousPageToken) {
                console.log("previous");
                chaine += '<button id="botPrevButton" type="button" onClick =\'getCommentThread("' + id + '",-1);\'>Previous</button>';
            }
            if(nextPageToken) {
                console.log("next");
                chaine += '<button id="botNextButton" type="button" onClick =\'getCommentThread("' + id + '",1);\'>Next</button>';
            }

            chaine += '</div>';

            $('#content').append(chaine);
            /*getCommentThread(id);*/
        });

}

function setToken(pageToken) {
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