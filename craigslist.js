function letsJQuery() {
  window.craigslist = function(){
    var self    = this;
    var posts   = $.makeArray( $('blockquote p:lt(100)') );
    var iframes = [];

    var init = function(){
      // add iFrame
      for(var i = 0; i < 5; i++) { iframes.push( _createIframe() ) }

      // append pics
      for(var i = 0; i < 5; i++) { _requestPicsForPost( posts.shift() ) }
    }

    var _createIframe = function() {
      //console.log('createIframe');
      var iframe = $('<iframe></iframe>');
      iframe.hide();
      iframe.attr('busy',false);
      $('body').prepend(iframe);
      iframe.bind('load', function(){
        _processPicsForPost( iframe );
      });
      return iframe;
    }

    var _findFreeIframe = function( callback, times ) {
      //console.log('findFreeIframe');
      times = times || 5;
      if(times == 0) return function(){};

      for( var i = 0; i < iframes.length; i++) {
        var iframe = iframes[i];
        if( !iframe[0].busy ) {
          iframe[0].busy = true;
          return callback( iframes[i] );
        }
      }

      setTimeout( _findFreeIframe(callback, times-1), 100 );
    }

    var _requestPicsForPost = function( post ){
      if(!post) return;
      //console.log(['requestPicsForPost, posts:', posts.length, post]);
      _findFreeIframe( function(iframe){
        post = $(post);

        post.append( '<div>Loading...</div>' );

        iframe[0].post = post;
        iframe.attr('src', post.find('a:first').attr('href') );
      } );
    }

    var _processPicsForPost = function( iframe ){
      //console.log('processPicsForPost');
      var post   = iframe[0].post;
      if (!post) return;
      var images = $.makeArray( iframe[0].contentDocument.getElementsByTagName('img') );

      iframe[0].busy = false;

      var container = post.find('div');
      container.html('');
      //container.css('border', '1px solid Red');

      while(images.length > 0){
        img = $( images.shift() );
        var ratio = _imageRatio(img);

        if (img && img.height() > 100 && ratio > 0.7 && ratio < 0.8 ){
          // console.log( img, img.height, img.width );
          img = img.clone();
          img.attr({ 'width':null, 'height':150 });
          container.append( img );
        }
      }

      post = posts.shift();
      if( post ) { _requestPicsForPost( post ); }
    }

    init();
  }

  var _imageRatio = function( img ) {
    return Math.min( img.height(), img.width() ) / Math.max( img.height(), img.width() );
  }

  c = new window.craigslist();
}

letsJQuery();