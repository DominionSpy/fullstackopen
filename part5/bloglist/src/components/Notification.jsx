const Notification = ({ message, successful }) => {
  if (message === null) {
    return null
  }

  const className = successful ? 'notification' : 'error'
  return (
    <div className={className}>
      {message}
    </div>
  )
}

export default Notification
