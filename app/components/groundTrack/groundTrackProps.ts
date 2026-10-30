
/**
 * defines the properties of a displayed satellite
 */
export interface IDisplaySatellite {
    orbitColor: string;
    orbitLineWidth?: number;
    showOrbitEclipses?: boolean;
    showOrbitEclipsesMarker?: boolean;
    showDirectionArrows?: boolean;
    orbitEclipsesLineDash?: number[];
    textColor: string;
    pointerBackgroundColor: string;
    pointerBorderColor: string;
    icon?: HTMLImageElement;
    tle: string;
    orbitsToShow: number;
    text: string;
}

/**
 * defines the properties of a displayed ground station
 */
export interface IDisplayStation {
    id: string;
    name: string;
    zoneColor: string;
    zoneBorderColor: string;
    gdsNameMappings: string[];
    textColor: string;
    iconColor: string;
    showIcon: boolean;
    latitude: number;
    longitude: number;
}

export interface IGroundTrackProps {
  width?: number;
  height?: number;
  /** URL of the background image (local import, public path or remote URL). */
  backgroundSrc?: string;
  /** Minimum elevation angle for ground station visibility circles, in degrees. */
  minElev?: number; 
  stations?: IDisplayStation[];
  satellites?: IDisplaySatellite[];
};