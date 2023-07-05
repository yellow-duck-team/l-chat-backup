import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

import 'Fab/pages/MessagePage.css';
import './RichText.css';
import React from 'react';

const richTextStyles = ['small', 'big', 'blue', 'green', 'red', 'pink'];

// Render rich text
export const renderRichText = (
  artistNum,
  chatId,
  richText,
  isLoading,
  onOpenMedia,
  onMediaLoad
) => {
  if (!richText || richText === '') return <p></p>;

  const textByLine = richText.split('\n');
  let totalImgCount = 0;

  // Render rich text by line
  for (let i = 0; i < textByLine.length; i++) {
    if (textByLine[i].includes('(Image)')) {
      // Image
      const { total, imgGrid } = renderRichTextImgGrid(
        artistNum,
        chatId,
        i,
        textByLine[i],
        totalImgCount,
        isLoading,
        onOpenMedia,
        onMediaLoad
      );
      textByLine[i] = imgGrid;
      totalImgCount = total;
    } else if (textByLine[i] === '') {
      // Empty Line
      textByLine[i] = <p key={`msgText-${i}`}> </p>;
    } else {
      // Color and Size
      textByLine[i] = renderStyledText(textByLine[i]);
      textByLine[i] = <p key={`msgText-${i}`}>{textByLine[i]}</p>;
    }
  }

  return textByLine;
};

// Render image grid
const renderRichTextImgGrid = (
  artistNum,
  chatId,
  lineNum,
  text,
  totalImgCount,
  isLoading = true,
  onOpenMedia = () => {},
  onMediaLoad = null
) => {
  const imgCount = text.split('(Image)').length - 1;
  let images = [];
  let i = totalImgCount;
  while (i < totalImgCount + imgCount) {
    let currImg = i;
    const image = require(`assets/fab/${artistNum}/media/${
      chatId.length === 1 ? '0' + chatId : chatId
    }_${i}.jpg`);
    const imageComponent = (
      <React.Fragment key={`rich-img-${lineNum}-${i}`}>
        {isLoading && <LoadingSpinner />}
        <img
          src={image}
          onClick={() =>
            onOpenMedia(
              true,
              image,
              `assets/fab/${artistNum}/media/${
                chatId.length === 1 ? '0' + chatId : chatId
              }`,
              currImg,
              totalImgCount + imgCount
            )
          }
          alt=""
          className={isLoading ? 'hidden' : ''}
          onLoad={onMediaLoad}
        />
      </React.Fragment>
    );
    images.push(imageComponent);
    i++;
  }

  const imgGrid = (
    <div
      key={`rich-imgs-${lineNum}`}
      className={`artist-msg rich-img-${imgCount}`}
    >
      {images}
    </div>
  );

  return { total: i, imgGrid };
};

// Render styled text
const renderStyledText = (text) => {
  const firstStyle = stylePrecedence(text);
  // If text doesn't have style
  if (firstStyle === '') return text;
  // If text has style
  let textListToStyle = text.split(`(${firstStyle})`);
  const splitText = textListToStyle[1].split(`(/${firstStyle})`);
  return (
    <span>
      {textListToStyle[0]}
      <span className={`rich-text-${firstStyle}`}>
        {firstStyle === 'big' ? renderStyledText(splitText[0]) : splitText[0]}
      </span>
      {textListToStyle.length > 2
        ? renderStyledText(
            splitText[1] + textListToStyle.slice(2).join(`(${firstStyle})`)
          )
        : renderStyledText(splitText[1])}
    </span>
  );
};

// Get index of first style, by the order of precedence
const stylePrecedence = (text) => {
  let index = -1;
  let firstStyle = '';
  for (let i = 0; i < richTextStyles.length; i++) {
    const j = text.indexOf(`(${richTextStyles[i]})`);
    if (j >= 0 && (index < 0 || j < index)) {
      index = j;
      firstStyle = richTextStyles[i];
    }
  }
  return firstStyle;
};
