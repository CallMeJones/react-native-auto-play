package com.margelo.nitro.swe.iternio.reactnativeautoplay.template

import androidx.car.app.CarContext
import androidx.car.app.model.CarLocation
import androidx.car.app.model.ItemList
import androidx.car.app.model.Metadata
import androidx.car.app.model.Place
import androidx.car.app.model.PlaceListMapTemplate
import androidx.car.app.model.PlaceMarker
import androidx.car.app.model.Row
import androidx.car.app.model.Template
import com.margelo.nitro.swe.iternio.reactnativeautoplay.NitroAction
import com.margelo.nitro.swe.iternio.reactnativeautoplay.NitroPlaceRowConfig
import com.margelo.nitro.swe.iternio.reactnativeautoplay.PlaceListMapTemplateConfig

/**
 * Android Auto place-list map (POI category).
 *
 * The host draws the map and the pins; this template only supplies a Place
 * (location + marker) per row. No surface callback, no map renderer in the
 * bundle, and no location collection: the car never starts tracking (ADR 0025).
 *
 * Rows are always browsable. PlaceListMapTemplate rejects a non-browsable row
 * that carries no distance span, and CRUW has no distance to show, so the
 * chevron is what makes the row valid.
 */
class PlaceListMapTemplate(context: CarContext, config: PlaceListMapTemplateConfig) :
    AndroidAutoTemplate<PlaceListMapTemplateConfig>(context, config) {

    override val isRenderTemplate = false
    override val templateId: String
        get() = config.id
    override val autoDismissMs = config.autoDismissMs

    override fun parse(): Template {
        val builder = PlaceListMapTemplate.Builder().apply {
            setTitle(Parser.parseText(config.title))
            setHeaderAction(
                config.headerActions
                    ?.firstOrNull { it.type == com.margelo.nitro.swe.iternio.reactnativeautoplay.NitroActionType.BACK }
                    ?.let { androidx.car.app.model.Action.BACK }
                    ?: androidx.car.app.model.Action.APP_ICON
            )
        }

        if (config.rows.isEmpty()) {
            builder.setLoading(true)
            return builder.build()
        }

        val list = ItemList.Builder().apply {
            config.rows.forEach { row ->
                addItem(buildRow(row))
            }
        }.build()

        builder.setItemList(list)
        return builder.build()
    }

    private fun buildRow(row: NitroPlaceRowConfig): Row {
        return Row.Builder().apply {
            setTitle(Parser.parseText(row.title))
            row.detailedText?.let { detailedText ->
                addText(Parser.parseText(detailedText))
            }
            row.image?.let { image ->
                setImage(Parser.parseImage(context, image))
            }
            // Always browsable: a non-browsable row without a distance span is
            // rejected by the host, and CRUW shows no distances.
            setBrowsable(true)
            row.place?.let { place ->
                // Row metadata carries a Place, which is how the host knows to
                // draw a marker for this row on the map.
                setMetadata(
                    Metadata.Builder()
                        .setPlace(
                            Place.Builder(
                                CarLocation.create(place.latitude, place.longitude)
                            ).apply {
                                val label = place.markerLabel
                                val light = place.markerColorLight
                                val dark = place.markerColorDark
                                val icon = place.markerImage
                                if (icon != null) {
                                    // A custom bitmap replaces the host's pin face.
                                    // AndroidX rejects setColor alongside a
                                    // TYPE_IMAGE icon, so the tint is dropped and
                                    // only the icon is applied.
                                    setMarker(
                                        PlaceMarker.Builder()
                                            .setIcon(
                                                Parser.parseImage(context, icon),
                                                PlaceMarker.TYPE_IMAGE
                                            )
                                            .build()
                                    )
                                } else if (label != null || (light != null && dark != null)) {
                                    setMarker(
                                        PlaceMarker.Builder().apply {
                                            label?.let { setLabel(it) }
                                            if (light != null && dark != null) {
                                                setColor(Parser.parseColor(light, dark))
                                            }
                                        }.build()
                                    )
                                }
                            }.build()
                        )
                        .build()
                )
            }
            row.onPress?.let { onPress ->
                setOnClickListener { onPress() }
            }
        }.build()
    }

    override fun setTemplateHeaderActions(headerActions: Array<NitroAction>?) {
        config = config.copy(headerActions = headerActions)
        super.applyConfigUpdate()
    }

    override fun onWillAppear() {
        config.onWillAppear?.let { it(null) }
    }

    override fun onWillDisappear() {
        config.onWillDisappear?.let { it(null) }
    }

    override fun onDidAppear() {
        config.onDidAppear?.let { it(null) }
    }

    override fun onDidDisappear() {
        config.onDidDisappear?.let { it(null) }
    }

    override fun onPopped() {
        config.onPopped?.let { it() }
        templates.remove(templateId)
    }

    fun updateItems(rows: Array<NitroPlaceRowConfig>) {
        config = config.copy(rows = rows)
        super.applyConfigUpdate()
    }
}
