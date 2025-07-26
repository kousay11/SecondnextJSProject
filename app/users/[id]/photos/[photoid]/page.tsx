import React from 'react'


interface Props {
  params: {
    id: string;
    photoid: string;
  };
}
const PhotoDetails = ({params : {id,photoid} }: Props) => {
  return (
<div>
  Photo Details {id} — Article {photoid} (c’est l’id de la photo)
</div>
  )
}

export default PhotoDetails