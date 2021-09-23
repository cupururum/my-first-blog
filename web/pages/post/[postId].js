// post.js
import groq from 'groq'
import imageUrlBuilder from '@sanity/image-url'
import BlockContent from '@sanity/block-content-to-react'
import client from '../../client'
//import { useRouter } from 'next/router'

function urlFor (source) {
  return imageUrlBuilder(client).image(source)
}

const Post = (props) => {
 
  const {
    title = 'Missing title',
    name = 'Missing name',
    categories,
    authorImage,
    body = []
  } = props.post
  
  return (
    <article>
      <h1>{title}</h1>
      <span>By {name}</span>
      {props.post.categories && (
        <ul>
          Posted in
          {props.post.categories.map(category => <li key={category}>{category}</li>)}
        </ul>
      )}
      {props.post.authorImage && (
        <div>
          <img
            src={urlFor(props.post.authorImage)
              .width(50)
              .url()}
          />
        </div>
      )}
      <BlockContent
        blocks={props.post.body}
        imageOptions={{ w: 320, h: 240, fit: 'max' }}
        {...client.config()}
      />
      {props.post.mainImage && (
        <div>
          <img
            src={urlFor(props.post.mainImage)
              .width(100)
              .url()}
          />
        </div>
      )}
    </article>
  )
}



export async function getStaticProps(context) {
  const postId = context.params.postId
  const post = await client.fetch(groq`*[_type == "post" && slug.current == $postId][0]{
    title,
    "name": author->name,
    "categories": categories[]->title,
    "authorImage": author->image,
    body,
    mainImage
  }`, {postId})
  return {
    props: {post}
  }
}

export async function getStaticPaths() {

  const allSlugs = await client.fetch(groq`*[defined(slug.current)][].slug.current`)

  return {
    paths: allSlugs.map(slug => ({ params: { postId: slug}})),
    fallback: false
  }
}

export default Post
