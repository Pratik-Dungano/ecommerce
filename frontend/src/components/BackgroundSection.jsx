import React from "react";
import PropTypes from "prop-types";

/**
 * BackgroundSection Component
 * A reusable component to set a background color for any section of your app.
 *
 * @param {string} cornerImage - URL of the additional image for the bottom-right corner.
 * @param {React.ReactNode} children - Content to render inside the section.
 * @param {object} additionalStyles - Additional inline styles.
 */
const BackgroundSection = ({
  cornerImage,
  children,
  additionalStyles = {},
}) => {
  return (
    <div
      style={{
        display: "flex", // Enables flexbox
        alignItems: "center", // Centers content vertically
        justifyContent: "center", // Centers content horizontally
        backgroundColor: "#c5c069", // Set the background color
        height: "100vh", // Full viewport height
        width: "100vw", // Full viewport width
        position: "relative", // For the fixed corner image
        ...additionalStyles, // Merge any additional styles
      }}
    >
      {children}
      {cornerImage && (
        <img
          src={cornerImage}
          alt="Corner decoration"
          style={{
            position: "fixed",
            bottom: "10px", // Distance from the bottom
            right: "10px", // Distance from the right
            width: "100px", // Set the size of the image
            height: "auto", // Maintain aspect ratio
            zIndex: 10, // Ensure it stays on top
          }}
        />
      )}
    </div>
  );
};

BackgroundSection.propTypes = {
  cornerImage: PropTypes.string,
  children: PropTypes.node,
  additionalStyles: PropTypes.object,
};

export default BackgroundSection;
  