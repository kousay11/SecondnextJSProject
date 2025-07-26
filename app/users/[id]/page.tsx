import React from 'react'

interface Props {
  params: {
    id: string;
  };
}

const UserDetailPage = ({params: {id}}:Props) => {
  return (
    <div>User Details Page {id}</div>
  )
}

export default UserDetailPage