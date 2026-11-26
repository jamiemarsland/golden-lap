#!/bin/sh
# Trial only: fakes a few smudges on the camera lens over a finished trailer, to judge the idea before building it into the game.
# A smudge = that patch of the picture slightly blurred and lifted, so it is invisible over dark road and trees and glows where bright sky sits behind it.
# usage: sh video/smudge.sh in.mp4 out.mp4 [strength 0-1, default 0.55]
K=${3:-0.55}
ffmpeg -v error -y -f lavfi -i "color=black:s=1920x1080,format=gray,geq=lum='255*$K*min(1, exp(-(pow((X-830)*0.95+(Y-215)*0.31,2)/(2*240*240)+pow(-(X-830)*0.31+(Y-215)*0.95,2)/(2*48*48))) + 0.8*exp(-(pow(X-1215,2)+pow(Y-395,2))/(2*70*70)) + 0.6*exp(-(pow((X-520)*0.8-(Y-430)*0.6,2)/(2*150*150)+pow((X-520)*0.6+(Y-430)*0.8,2)/(2*30*30))) + 0.5*exp(-(pow(X-1010,2)+pow(Y-610,2))/(2*45*45)))'" -frames:v 1 video/raw/smudge-mask.png
ffmpeg -v error -y -i "$1" -loop 1 -i video/raw/smudge-mask.png -filter_complex "[0:v]format=gbrp,split=3[a][b][c];[b]gblur=sigma=16,eq=brightness=0.035:contrast=0.93,format=gbrp[bl];[1:v]format=gbrp[m];[a][bl][m]maskedmerge[sm];[sm][c]overlay=enable='gte(t,17.7)':shortest=1,format=yuv420p[v]" -map "[v]" -map 0:a -c:v libx264 -preset medium -crf 17 -c:a copy "$2"
