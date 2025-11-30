import arialMetrics from '@capsizecss/metrics/arial'
import helveticaMetrics from '@capsizecss/metrics/helvetica'
import robotoMetrics from '@capsizecss/metrics/roboto'
import interMetrics from '@capsizecss/metrics/inter'
import openSansMetrics from '@capsizecss/metrics/openSans'
import montserratMetrics from '@capsizecss/metrics/montserrat'
import latoMetrics from '@capsizecss/metrics/lato'
import poppinsMetrics from '@capsizecss/metrics/poppins'
import ralewayMetrics from '@capsizecss/metrics/raleway'
import sourceSans3Metrics from '@capsizecss/metrics/sourceSans3'
import oswaldMetrics from '@capsizecss/metrics/oswald'
import merriweatherMetrics from '@capsizecss/metrics/merriweather'
import playfairDisplayMetrics from '@capsizecss/metrics/playfairDisplay'
import ubuntuMetrics from '@capsizecss/metrics/ubuntu'
import rubikMetrics from '@capsizecss/metrics/rubik'
import nunitoMetrics from '@capsizecss/metrics/nunito'
import notoSansMetrics from '@capsizecss/metrics/notoSans'
import ptSansMetrics from '@capsizecss/metrics/pTSans'
import ptSerifMetrics from '@capsizecss/metrics/pTSerif'
import workSansMetrics from '@capsizecss/metrics/workSans'
import quicksandMetrics from '@capsizecss/metrics/quicksand'
import firaSansMetrics from '@capsizecss/metrics/firaSans'
import barlowMetrics from '@capsizecss/metrics/barlow'
import mulishMetrics from '@capsizecss/metrics/mulish'
import titilliumWebMetrics from '@capsizecss/metrics/titilliumWeb'
import kanitMetrics from '@capsizecss/metrics/kanit'
import dmSansMetrics from '@capsizecss/metrics/dMSans'
import heeboMetrics from '@capsizecss/metrics/heebo'
import ibmPlexSansMetrics from '@capsizecss/metrics/iBMPlexSans'
import muktaMetrics from '@capsizecss/metrics/mukta'
import oxygenMetrics from '@capsizecss/metrics/oxygen'
import arimoMetrics from '@capsizecss/metrics/arimo'
import dosisMetrics from '@capsizecss/metrics/dosis'
import josefinSansMetrics from '@capsizecss/metrics/josefinSans'
import cabinMetrics from '@capsizecss/metrics/cabin'
import antonMetrics from '@capsizecss/metrics/anton'
import bitterMetrics from '@capsizecss/metrics/bitter'
import crimsonTextMetrics from '@capsizecss/metrics/crimsonText'
import hindMetrics from '@capsizecss/metrics/hind'
import inconsolataMetrics from '@capsizecss/metrics/inconsolata'
import karlaMetrics from '@capsizecss/metrics/karla'
import libreBaskervilleMetrics from '@capsizecss/metrics/libreBaskerville'
import libreFranklinMetrics from '@capsizecss/metrics/libreFranklin'
import loraMetrics from '@capsizecss/metrics/lora'
import manropeMetrics from '@capsizecss/metrics/manrope'
import mavenProMetrics from '@capsizecss/metrics/mavenPro'
import nanumGothicMetrics from '@capsizecss/metrics/nanumGothic'
import nunitoSansMetrics from '@capsizecss/metrics/nunitoSans12pt'
import pacificoMetrics from '@capsizecss/metrics/pacifico'
import ptSansNarrowMetrics from '@capsizecss/metrics/pTSansNarrow'
import questrialMetrics from '@capsizecss/metrics/questrial'
import righteousMetrics from '@capsizecss/metrics/righteous'
import robotoCondensedMetrics from '@capsizecss/metrics/robotoCondensed'
import robotoMonoMetrics from '@capsizecss/metrics/robotoMono'
import robotoSlabMetrics from '@capsizecss/metrics/robotoSlab'
import signikaMetrics from '@capsizecss/metrics/signika'
import tekoMetrics from '@capsizecss/metrics/teko'
import varelaRoundMetrics from '@capsizecss/metrics/varelaRound'
import vollkornMetrics from '@capsizecss/metrics/vollkorn'
import yantramanavMetrics from '@capsizecss/metrics/yantramanav'

const FONT_METRICS_MAP: Record<string, any> = {
  'Arial': arialMetrics,
  'Helvetica': helveticaMetrics,
  'Helvetica Neue': helveticaMetrics,
  'Roboto': robotoMetrics,
  'Inter': interMetrics,
  'Open Sans': openSansMetrics,
  'Montserrat': montserratMetrics,
  'Lato': latoMetrics,
  'Poppins': poppinsMetrics,
  'Raleway': ralewayMetrics,
  'Source Sans 3': sourceSans3Metrics,
  'Source Sans Pro': sourceSans3Metrics, // Alias
  'Oswald': oswaldMetrics,
  'Merriweather': merriweatherMetrics,
  'Playfair Display': playfairDisplayMetrics,
  'Ubuntu': ubuntuMetrics,
  'Rubik': rubikMetrics,
  'Nunito': nunitoMetrics,
  'Noto Sans': notoSansMetrics,
  'PT Sans': ptSansMetrics,
  'PT Serif': ptSerifMetrics,
  'Work Sans': workSansMetrics,
  'Quicksand': quicksandMetrics,
  'Fira Sans': firaSansMetrics,
  'Barlow': barlowMetrics,
  'Mulish': mulishMetrics,
  'Muli': mulishMetrics, // Alias
  'Titillium Web': titilliumWebMetrics,
  'Kanit': kanitMetrics,
  'DM Sans': dmSansMetrics,
  'Heebo': heeboMetrics,
  'IBM Plex Sans': ibmPlexSansMetrics,
  'Mukta': muktaMetrics,
  'Oxygen': oxygenMetrics,
  'Arimo': arimoMetrics,
  'Dosis': dosisMetrics,
  'Josefin Sans': josefinSansMetrics,
  'Cabin': cabinMetrics,
  'Anton': antonMetrics,
  'Bitter': bitterMetrics,
  'Crimson Text': crimsonTextMetrics,
  'Hind': hindMetrics,
  'Inconsolata': inconsolataMetrics,
  'Karla': karlaMetrics,
  'Libre Baskerville': libreBaskervilleMetrics,
  'Libre Franklin': libreFranklinMetrics,
  'Lora': loraMetrics,
  'Manrope': manropeMetrics,
  'Maven Pro': mavenProMetrics,
  'Nanum Gothic': nanumGothicMetrics,
  'Nunito Sans': nunitoSansMetrics,
  'Pacifico': pacificoMetrics,
  'PT Sans Narrow': ptSansNarrowMetrics,
  'Questrial': questrialMetrics,
  'Righteous': righteousMetrics,
  'Roboto Condensed': robotoCondensedMetrics,
  'Roboto Mono': robotoMonoMetrics,
  'Roboto Slab': robotoSlabMetrics,
  'Signika': signikaMetrics,
  'Teko': tekoMetrics,
  'Varela Round': varelaRoundMetrics,
  'Vollkorn': vollkornMetrics,
  'Yantramanav': yantramanavMetrics
}

export function getFontMetrics(fontFamily: string): any | null {
  if (FONT_METRICS_MAP[fontFamily]) {
    return FONT_METRICS_MAP[fontFamily]
  }

  const normalizedFamily = fontFamily.toLowerCase()
  for (const [key, value] of Object.entries(FONT_METRICS_MAP)) {
    if (key.toLowerCase() === normalizedFamily) {
      return value
    }
  }

  return null
}
