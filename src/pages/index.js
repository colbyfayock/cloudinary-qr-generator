import { useState, useEffect, useRef } from 'react';
import Head from 'next/head'
import { Cloudinary } from '@cloudinary/url-gen';

import Layout from '@components/Layout';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Home.module.scss'

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  },
  url: {
    forceVersion: false
  }
});

const defaultUrl = 'https://spacejelly.dev';

export default function Home() {
  const imgRef = useRef();

  const [url, setUrl] = useState();
  const [imageIsLoaded, setImageIsLoaded] = useState();

  const activeUrl = url || defaultUrl;
  const qrUrl = cld.image(`mediajams/qr/${sanitizeUrl(activeUrl)}`).effect('e_vectorize:detail:1.0').format('svg').toURL();

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
          <input type="url" name="url" defaultValue={defaultUrl} />
          <Button>Submit</Button>
        </form>

        <h2>QR Code</h2>

        <p>
          <img ref={imgRef} width="500" height="500" src={qrUrl} alt={`QR code directing to ${url}`} />
        </p>


        <h2>Details</h2>

        <ul>
          <li>
            <strong>URL:</strong> <a href={ activeUrl }>{ activeUrl }</a></li>
          <li>
            <strong>Cloudinary URL:</strong> <a href={ qrUrl }>{ qrUrl }</a></li>
        </ul>

        <h2>More Info</h2>

        <p>
          This QR code generator utilizes
          Cloudinary&apos;s <a href="https://cloudinary.com/documentation/fetch_remote_images#configuring_auto_upload_url_mapping" rel="noreferrer">dynamic auto-upload mapping</a> along
          with Google&apos;s <a href="https://developers.google.com/chart/infographics/docs/qr_codes" rel="noreferrer">QR Code API</a> to
          dynamically create QR code images.
        </p>
      </Container>
    </Layout>
  )
}

/**
 * sanitizeUrl
 */

function sanitizeUrl(url) {
  const length = url.length;
  if ( url.charAt(length - 1) !== '/' ) return url;
  return url.substr(0, length - 1);
}