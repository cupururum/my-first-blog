import Link from 'next/link'
import groq from 'groq'
import client from '../client'

const Index = (props) => {
  console.log(props)
   
    return (
      <div>
        <h1>Welcome to a blog!</h1>
        {props.posts.map(
          ({ _id, title = '', slug = '', _updatedAt = '' }) =>
            slug && (
              <li key={_id}>
                <Link href="/post/[postId]" as={`/post/${slug.current}`}>
                  <a>{title}</a>
                </Link>{' '}
                ({new Date(_updatedAt).toDateString()})
              </li>
            )
        )}
      </div>
    )
}

export async function getStaticProps() {
  const posts = await client.fetch(groq`
    *[_type == "post"]
  `)
  return {
    props: {posts}
  }
}


export default Index