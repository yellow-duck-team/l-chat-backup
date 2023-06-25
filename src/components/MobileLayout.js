import Header from './Header/Header';
import './MobileLayout.css';

function MobileLayout({
  className = '',
  headerUrl,
  children,
  isHeader = true
}) {
  return (
    <>
      <div className={`mobile ${className} ${isHeader && 'mobile-header'}`}>
        {isHeader && <Header url={headerUrl} />}
        {children}
      </div>
    </>
  );
}

export default MobileLayout;
