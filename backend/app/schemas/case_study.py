from pydantic import BaseModel, ConfigDict


class CaseStudyResponse(BaseModel):
    id: str
    vertical: str
    client_highlight: str
    result_metric: str

    model_config = ConfigDict(from_attributes=True)