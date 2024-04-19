function EmptyList({ listType = 'Chat history', darkMode }) {
  return (
    <h3 className={`empty-list ${darkMode && 'dark'}`}>{listType} is empty.</h3>
  );
}

export default EmptyList;
