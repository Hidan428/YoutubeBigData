<html>
	<meta name="viewport" content="width=device-width, user-scalable=no" charset="UTF-8">
	<script src="js/comment-scripts.js" type="text/javascript"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
  	<script src="https://apis.google.com/js/client.js?onload=googleApiClientReady">  </script>

  	<link rel="stylesheet" href="./css/comment-style.css">

	<title>
		Commentaires de la vidéo
	</title>

	<body onload='getCommentThread(<?php 
		echo "\"".$_GET["videoId"]."\"" ?>,0);
	'>
		<div id="content">

		</div>
	
	</body>
</html>