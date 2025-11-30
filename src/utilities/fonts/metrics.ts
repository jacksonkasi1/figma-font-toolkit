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
  'Source Sans 3': sourceSans3Metrics
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
