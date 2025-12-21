export const ScheduleCacheKey = {
  byId: (id: string) => `schedule:id:${id}`,
  list: (params: any) =>
    `schedule:list:${Buffer.from(JSON.stringify(params)).toString('base64')}`,
};