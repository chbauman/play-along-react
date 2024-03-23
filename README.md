# YouTube Play-Along React Webapp

This project is a React App that provides sheet music for a few
music pieces that are available on YouTube.
The sheet music is displayed in sync. with the video such
that it is possible to play along with a music instrument.

The actual app is hosted on Github pages
on [@chbauman](https://www.github.com/chbauman)'s custom
domain at https://ytplayalong.chrisbaumann.ch.

![Screenshot](/play-along/public/screenshot.png?raw=true "Screenshot")

## Development

To publish the most recent version run the following commands:

```
cd play-along
npm run build
npm run deploy
```

There is also a [python script](/export.py) that can
be used for exporting the sheet music to XML
and reducing the XML files. It starts with the most recently
modified ones and takes a parameter specifying how
many files shall be exported.

```
python export.py 4
```
