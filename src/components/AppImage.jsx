import React from 'react';

function Image({
  src,
  alt = "Image Name",
  className = "",
  ...props
}) {
  const fallbackSrc = "/assets/images/no_image.svg";

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        if (e.currentTarget.src.includes(fallbackSrc)) {
          return;
        }
        e.currentTarget.src = fallbackSrc;
      }}
      {...props}
    />
  );
}

export default Image;
