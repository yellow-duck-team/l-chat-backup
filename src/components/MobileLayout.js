import Header from './Header/Header';
import './MobileLayout.css';

function MobileLayout({
  className = '',
  headerUrl,
  children,
  isHeader = true,
  moreButtonAction = null
}) {
  return (
    <>
      <div className={`mobile ${className} ${isHeader && 'mobile-header'}`}>
        {isHeader && (
          <Header url={headerUrl} moreButtonAction={moreButtonAction} />
        )}
        {children}
      </div>
    </>
  );
}

export default MobileLayout;
