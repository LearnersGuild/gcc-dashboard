import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import {Parser as HtmlToReactParser} from 'html-to-react'
import AppBar from 'react-toolbox/lib/app_bar/AppBar'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import Dropzone from 'react-dropzone'
import theme from '../static/theme'
import iconsMetadata from '../static/icons-metadata'
import DateSelect from '../components/DateSelect'



// favicons
const h2r = new HtmlToReactParser()
const iconsMetadataElements = iconsMetadata.map((link, i) => {
  const {type, props} = h2r.parse(link)
  return React.createElement(type, {...props, key: i})
})

class index extends React.Component {
  constructor(props)  {
    super(props);
    this.state = {
      files: []
    }
  }
  
  onDrop = (files) => {
    const data = new FormData();
    data.append('workbook', files[0]);

    fetch('/api/uploads', {
      method: "POST",
      body: data,  
    }).then(function(response) {
      alert('File successfully uploaded');  
    }, function(error) {
      console.log(error.message)
    })
  }

  render() {
    const leftIconSrc = 'https://brand.learnersguild.org/assets/learners-guild-icon.svg'
    const leftIcon =
      <Link href="/">
        <span>
          <img id="logo" src={leftIconSrc} alt="logo" title="Learners Guild"/>
          <style jsx>{`
            img#logo {
              width: 40px;
              height: 40px;
            }
          `}</style>
        </span>
      </Link>

  const title =
    <span>
      <h1 className="title">GCC Dashboard</h1>
      <style jsx>{`
        h1.title {
          display: inline-block;
          margin-left: 10px;
          font-family: Roboto;
          font-size: 1.3em;
        }
      `}</style>
    </span>

    return (
      <div>
        <Head>
          <title>GCC Dashboard</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          {iconsMetadataElements}
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"/>
          <link href="/static/theme.css" rel="stylesheet"/>
        </Head>
        <ThemeProvider theme={theme}>
          <div>
            <AppBar
              leftIcon={leftIcon}
              title={title}
            />
            <Dropzone onDrop={this.onDrop.bind(this)}>
              <p>Try dropping some files here, or click to select files to upload.</p>
            </Dropzone>
            <div>
              <DateSelect/>
            </div>
          </div>
        </ThemeProvider>

      </div>
    )
  }
}

export default index
