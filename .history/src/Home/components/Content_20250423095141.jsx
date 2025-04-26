import './Content.css';

const Content = ({ contentRef, backgroundOpacity }) => {
  return (
    <div ref={contentRef} className="content-container">
      <div 
        className="content-background" 
        style={{ opacity: backgroundOpacity }}
      ></div>
      <div className="content-inner" style={{ opacity: 1 - backgroundOpacity }}>
        <div className="content-section">
          <h1 className="content-title">Scroll-Activated Fading Effect</h1>
          <p className="content-paragraph">
            This component demonstrates a smooth fading effect as you scroll down the page. 
            The yellow background gradually transitions to transparent, revealing the content below.
          </p>
          <p className="content-paragraph">
            This design technique is commonly used in modern websites to create a seamless 
            transition between sections while maintaining visual continuity.
          </p>
        </div>
        
        <div className="content-section">
          <h2 className="content-subtitle">How It Works</h2>
          <p className="content-paragraph">
            We're using a combination of React hooks and CSS to create this effect. As you scroll, 
            we track the scroll position and adjust the opacity of the background layer accordingly.
          </p>
          <ul className="content-list">
            <li>The scroll listener detects your position on the page</li>
            <li>We calculate how far you've scrolled into the content section</li>
            <li>The opacity of the background decreases proportionally</li>
            <li>The transition feels smooth and natural</li>
          </ul>
        </div>
        
        <div className="content-section">
          <h2 className="content-subtitle">Applications</h2>
          <p className="content-paragraph">
            This effect can be used in various contexts to create visually engaging transitions:
          </p>
          <div className="content-cards">
            <div className="content-card">
              <h3 className="card-title">Product Pages</h3>
              <p className="card-text">Create smooth transitions between product information sections.</p>
            </div>
            <div className="content-card">
              <h3 className="card-title">Landing Pages</h3>
              <p className="card-text">Guide the user's attention from hero sections to content below.</p>
            </div>
            <div className="content-card">
              <h3 className="card-title">Portfolios</h3>
              <p className="card-text">Separate project showcases with elegant transitions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;