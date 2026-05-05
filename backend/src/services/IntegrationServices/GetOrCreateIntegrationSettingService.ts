import IntegrationSetting from "../../models/IntegrationSetting";

const defaultValues = {
  n8nActive: false,
  chatgptActive: false,
  chatgptModel: "gpt-4.1-mini",
  chatgptTemperature: 0.7,
  chatgptMaxTokens: 500,
  evolutionActive: false,
  evolutionUseAsDefault: false
};

const GetOrCreateIntegrationSettingService =
  async (): Promise<IntegrationSetting> => {
    let setting = await IntegrationSetting.findOne({
      order: [["id", "ASC"]]
    });

    if (!setting) {
      setting = await IntegrationSetting.create(defaultValues);
    }

    return setting;
  };

export default GetOrCreateIntegrationSettingService;
