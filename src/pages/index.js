import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import {Parser as HtmlToReactParser} from 'html-to-react'
import AppBar from 'react-toolbox/lib/app_bar/AppBar'
import Tabs from 'react-toolbox/lib/tabs/Tabs'
import Tab from 'react-toolbox/lib/tabs/Tab'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import theme from '../static/theme'
import iconsMetadata from '../static/icons-metadata'
import GCCFileDownload from '../components/GCCFileDownload'
import JobsReport from '../components/JobsReport'
// import PerformanceReport from '../components/PerformanceReport'
import ISAReport from '../components/ISAReport'
import MissingDataReport from '../components/MissingDataReport'
import FileUpload from '../components/FileUpload'

// favicons
const h2r = new HtmlToReactParser()
const iconsMetadataElements = iconsMetadata.map((link, i) => {
  const {type, props} = h2r.parse(link)
  return React.createElement(type, {...props, key: i})
})

class index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0
    }
    this.handleTabChange = this.handleTabChange.bind(this)
  }

  handleTabChange(index) {
    this.setState({index})
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
            <Tabs index={this.state.index} onChange={this.handleTabChange}>
              <Tab label='GCC Report Download'><GCCFileDownload/></Tab>
              <Tab label='Jobs Report'><JobsReport/></Tab>
              {/* <Tab label='Performance Report'><PerformanceReport/></Tab> */}
              <Tab label='ISA Report'><ISAReport/></Tab>
              <Tab label='Missing Data Report'><MissingDataReport/></Tab>
              <Tab label='Vemo File Upload'><FileUpload/></Tab>
            </Tabs>
          </div>
        </ThemeProvider>

      </div>
    )
  }
}

export default index
