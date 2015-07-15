/*jslint node: true */
"use strict";

//require([
//	'/lib/videojs/video.min.js',
//	'/lib/videojs-contrib-media-sources/videojs-media-sources.js',
//	'/lib/videojs-contrib-hls/videojs-hls.js',
//	'/lib/videojs-contrib-hls/xhr.js',
//	'/lib/videojs-contrib-hls/stream.js',
//	'/lib/videojs-contrib-hls/flv-tag.js',
//	'/lib/videojs-contrib-hls/exp-golomb.js',
//	'/lib/videojs-contrib-hls/h264-extradata.js',
//	'/lib/videojs-contrib-hls/h264-stream.js',
//	'/lib/videojs-contrib-hls/aac-stream.js',
//	'/lib/videojs-contrib-hls/metadata-stream.js',
//	'/lib/videojs-contrib-hls/segment-parser.js',
//	'/lib/videojs-contrib-hls/m3u8/m3u8-parser.js',
//	'/lib/videojs-contrib-hls/playlist.js',
//	'/lib/videojs-contrib-hls/playlist-loader.js'
//], function (videojs) {
//	console.log(videojs);
//	console.log('requireJS');
//});
//

require.config({
	baseUrl: "/lib",
	paths: {
		jquery: 'jquery/jquery',
		videojs: 'videojs/video',
		mediaSources: 'videojs-contrib-media-sources/videojs-media-sources',
		hls: 'videojs-contrib-hls/videojs-hls',
		xhr: 'videojs-contrib-hls/xhr',
		stream: 'videojs-contrib-hls/stream',
		flvTag: 'videojs-contrib-hls/flv-tag',
		expGolomb: 'videojs-contrib-hls/exp-golomb',
		h264Extradata: 'videojs-contrib-hls/h264-extradata',
		h264Stream: 'videojs-contrib-hls/h264-stream',
		aacStream: 'videojs-contrib-hls/aac-stream',
		metadataStream: 'videojs-contrib-hls/metadata-stream',
		segmentParser: 'videojs-contrib-hls/segment-parser',
		m3u8Parser: 'videojs-contrib-hls/m3u8/m3u8-parser',
		playlist: 'videojs-contrib-hls/playlist',
		playlistLoader: '/lib/videojs-contrib-hls/playlist-loader'
	},
	shim: {
		mediaSources: {
			deps: ['videojs']
		},
		hls: {
			deps: ['mediaSources']
		},
		xhr: {
			deps: ['hls']
		},
		stream: {
			deps: ['hls']
		},
		flvTag: {
			deps: ['hls']
		},
		expGolomb: {
			deps: ['hls']
		},
		h264Extradata: {
			deps: ['expGolomb', 'flvTag']
		},
		h264Stream: {
			deps: ['h264Extradata']
		},
		aacStream: {
			deps: ['flvTag']
		},
		metadataStream: {
			deps: ['stream']
		},
		segmentParser: {
			deps: ['h264Stream', 'aacStream', 'metadataStream']
		},
		m3u8Parser: {
			deps: ['stream']
		},
		playlist:  {
			deps: ['hls']
		},
		playlistLoader: {
			deps: ['playlist', 'xhr', 'm3u8Parser']
		}
	}
});

require(['jquery', 'videojs', 'mediaSources', 'hls', 'xhr', 'stream', 'flvTag', 'expGolomb', 'h264Extradata', 'h264Stream', 'aacStream', 'metadataStream', 'segmentParser', 'm3u8Parser', 'playlist', 'playlistLoader'], function ($, videojs) {
	videojs.options.flash.swf = '/lib/videojs/video-js.swf';
	// initialize the player
	console.log('beforeReady');
	var player1 = videojs("video1").ready(function () {
		console.log('play');
		this.play();
	});
});
