import { UsePresetOptions, TPreset, SetOption, SetExample } from 'librechat-data-provider';
import { useRecoilState, useRecoilValue } from 'recoil';
import { cleanupPreset } from '~/utils';
import store from '~/store';

const usePresetOptions: UsePresetOptions = (_preset) => {
  const [preset, setPreset] = useRecoilState(store.preset);
  const endpointsConfig = useRecoilValue(store.endpointsConfig);
  if (!_preset) {
    return false;
  }
  const getConversation: () => TPreset | null = () => preset;
  const setOption: SetOption = (param) => (newValue) => {
    const update = {};
    update[param] = newValue;
    setPreset((prevState) =>
      cleanupPreset({
        preset: {
          ...prevState,
          ...update,
        },
        endpointsConfig,
      }),
    );
  };

  const setExample: SetExample = (i, type, newValue = null) => {
    const update = {};
    const current = preset?.examples?.slice() || [];
    const currentExample = { ...current[i] } || {};
    currentExample[type] = { content: newValue };
    current[i] = currentExample;
    update['examples'] = current;
    setPreset((prevState) =>
      cleanupPreset({
        preset: {
          ...prevState,
          ...update,
        },
        endpointsConfig,
      }),
    );
  };

  const addExample: () => void = () => {
    const update = {};
    const current = preset?.examples?.slice() || [];
    current.push({ input: { content: '' }, output: { content: '' } });
    update['examples'] = current;
    setPreset((prevState) =>
      cleanupPreset({
        preset: {
          ...prevState,
          ...update,
        },
        endpointsConfig,
      }),
    );
  };

  const removeExample: () => void = () => {
    const update = {};
    const current = preset?.examples?.slice() || [];
    if (current.length <= 1) {
      update['examples'] = [{ input: { content: '' }, output: { content: '' } }];
      setPreset((prevState) =>
        cleanupPreset({
          preset: {
            ...prevState,
            ...update,
          },
          endpointsConfig,
        }),
      );
      return;
    }
    current.pop();
    update['examples'] = current;
    setPreset((prevState) =>
      cleanupPreset({
        preset: {
          ...prevState,
          ...update,
        },
        endpointsConfig,
      }),
    );
  };

  const setAgentOption: SetOption = (param) => (newValue) => {
    const editablePreset = JSON.parse(JSON.stringify(_preset));
    const { agentOptions } = editablePreset;
    agentOptions[param] = newValue;
    setPreset((prevState) =>
      cleanupPreset({
        preset: {
          ...prevState,
          agentOptions,
        },
        endpointsConfig,
      }),
    );
  };

  const checkPluginSelection: (value: string) => boolean = () => false;
  const setTools: (newValue: string) => void = () => {
    return;
  };

  return {
    setOption,
    setExample,
    addExample,
    removeExample,
    getConversation,
    checkPluginSelection,
    setAgentOption,
    setTools,
  };
};

export default usePresetOptions;
