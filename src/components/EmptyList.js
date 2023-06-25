import './EmptyList.css';

function EmptyList({ listType = 'Chat history' }) {
  return <h3 className="empty-list">{listType} is empty.</h3>;
}

export default EmptyList;
