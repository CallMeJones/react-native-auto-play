package com.margelo.nitro.swe.iternio.reactnativeautoplay

import com.margelo.nitro.core.Promise
import com.margelo.nitro.swe.iternio.reactnativeautoplay.template.AndroidAutoTemplate
import com.margelo.nitro.swe.iternio.reactnativeautoplay.template.PlaceListMapTemplate

/**
 * Android-only binding for the host-rendered place-list map (ADR 0025).
 * Mirrors HybridListTemplate; no iOS counterpart because CarPlay uses a
 * different map story.
 */
class HybridPlaceListMapTemplate : HybridPlaceListMapTemplateSpec() {

    override fun createPlaceListMapTemplate(config: PlaceListMapTemplateConfig) {
        val context = AndroidAutoSession.getRootContext()
            ?: throw IllegalArgumentException("createPlaceListMapTemplate failed, carContext not found")

        val template = PlaceListMapTemplate(context, config)
        AndroidAutoTemplate.setTemplate(config.id, template)
    }

    override fun updatePlaceListMapTemplateItems(
        templateId: String, rows: Array<NitroPlaceRowConfig>
    ): Promise<Unit> {
        return Promise.async {
            val template = AndroidAutoTemplate.getTemplate<PlaceListMapTemplate>(templateId)
            template.updateItems(rows)
        }
    }
}
