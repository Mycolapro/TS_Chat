import React from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

mermaid.initialize({
  startOnLoad: true,
  theme: 'base',
  themeVariables: {
    primaryColor: 'rgb(32, 33, 35)',
    primaryTextColor: '#fff',
    primaryBorderColor: 'rgb(32, 33, 35)',
    lineColor: '#F8B229',
    secondaryColor: '#006100',
    tertiaryColor: '#fff',
    backgroundColor: '#000',
  },
  securityLevel: 'loose',
  themeCSS: `
    g.classGroup rect {
      fill: #282a36;
      stroke: #6272a4;
    } 
    g.classGroup text {
      fill: #f8f8f2;
    }
    g.classGroup line {
      stroke: #f8f8f2;
      stroke-width: 0.5;
    }
    .classLabel .box {
      stroke: #21222c;
      stroke-width: 3;
      fill: #21222c;
      opacity: 1;
    }
    .classLabel .label {
      fill: #f1fa8c;
    }
    .relation {
      stroke: #ff79c6;
      stroke-width: 1;
    }
    #compositionStart, #compositionEnd {
      fill: #bd93f9;
      stroke: #bd93f9;
      stroke-width: 1;
    }
    #aggregationEnd, #aggregationStart {
      fill: #21222c;
      stroke: #50fa7b;
      stroke-width: 1;
    }
    #dependencyStart, #dependencyEnd {
      fill: #00bcd4;
      stroke: #00bcd4;
      stroke-width: 1;
    } 
    #extensionStart, #extensionEnd {
      fill: #f8f8f2;
      stroke: #f8f8f2;
      stroke-width: 1;
    }`,
  fontFamily: 'Fira Code',
});

interface MermaidProps {
  chart: string;
  forwardedRef: React.Ref<HTMLDivElement>;
}

class Mermaid extends React.Component<MermaidProps> {
  componentDidMount() {
    mermaid.contentLoaded();
  }

  render() {
    return (
      <div
        suppressHydrationWarning
        ref={this.props.forwardedRef}
        className="mermaid flex w-full justify-center py-2"
      >
        {this.props.chart}
      </div>
    );
  }
}

export default React.forwardRef<HTMLDivElement, Omit<MermaidProps, 'forwardedRef'>>(
  (props, ref) => <Mermaid {...props} forwardedRef={ref} />,
);
