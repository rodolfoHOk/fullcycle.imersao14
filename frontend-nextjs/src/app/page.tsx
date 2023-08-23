import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/new-route');

  return <p>Loading...</p>;
}
