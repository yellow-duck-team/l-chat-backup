import Header from './Header/Header';

function MobileLayout({
  className = '',
  headerUrl,
  children,
  isHeader = true
}) {
  return (
    <div className={`mobile ${className}`}>
      {isHeader && <Header url={headerUrl} />}
      {children}
    </div>
  );
}

export default MobileLayout;
