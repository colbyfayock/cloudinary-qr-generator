import { useState } from 'react';
import Head from 'next/head'
import { Cloudinary } from '@cloudinary/url-gen';

import Layout from '@components/Layout';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Home.module.scss'

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  }
});

function sanitizeUrl(url) {
  const length = url.length;
  if ( url.charAt(length - 1) !== '/' ) return url;
  return url.substr(0, length - 1);
}

// https://res.cloudinary.com/colbycloud-mediajams/image/upload/e_vectorize,f_svg/mediajams/qr/https://spacejelly.dev

export default function Home() {
  const [url, setUrl] = useState('https://spacejelly.dev');

  const qrUrl = cld.image(`mediajams/qr/${sanitizeUrl(url)}`).setVersion().toURL().replace('v1/', '');

  function handleOnSubmit(e) {
    e.preventDefault();
    const url = Array.from(e.currentTarget.elements).find(({ name }) => name === 'url').value;
    setUrl(url);
  }

  return (
    <Layout>
      <Head>
        <title>Click or Press</title>
        <meta name="description" content="Click or press the button!" />
      </Head>

      <Container className={styles.homeContainer}>
        <h1>QR Code Generator</h1>

        <h2>Enter your URL below...</h2>

        <form onSubmit={handleOnSubmit}>
          <input type="url" name="url" defaultValue="https://spacejelly.dev" />
          <Button>Submit</Button>
        </form>

        <h2>QR Code</h2>


        <p>
          <img width="500" height="500" src={qrUrl} />
        </p>


        <h2>Details</h2>

        <ul>
          <li>
            <strong>URL:</strong> <a href={ url }>{ url }</a></li>
          <li>
            <strong>Cloudinary URL:</strong> <a href={ qrUrl }>{ qrUrl }</a></li>
        </ul>

        <h2>More Info</h2>

        <p>
          This QR code generator utilizes
          Cloudinary's <a href="https://cloudinary.com/documentation/fetch_remote_images#configuring_auto_upload_url_mapping" rel="noreferrer">dynamic auto-upload mapping</a> along
          with <a href="https://developers.google.com/chart/infographics/docs/qr_codes" rel="noreferrer">Google's QR Code API</a> to
          dynamically create QR code images.
        </p>
      </Container>
    </Layout>
  )
}